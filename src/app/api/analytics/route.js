import clientPromise from "@/lib/dbConnect";
import { BetaAnalyticsDataClient } from '@google-analytics/data';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const dateRange = searchParams.get('days') || '7';

    // 1. Fetch Google Analytics config from General Settings db
    const clientDb = await clientPromise;
    const db = clientDb.db("snowfye");
    const settings = await db.collection("general_settings").findOne({});

    if (!settings || !settings.gaPropertyId || !settings.gaServiceJson) {
      return new Response(JSON.stringify({ 
        error: "Google Analytics is not configured. Please add the Property ID and Service Account JSON in General Settings.",
        notConfigured: true
      }), { status: 400 });
    }

    const { gaPropertyId, gaServiceJson } = settings;
    
    // Parse the JSON securely
    let credentials;
    try {
      credentials = JSON.parse(gaServiceJson);
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid Google Service Account JSON format." }), { status: 400 });
    }

    // 2. Initialize the Google Analytics Data API Client
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
      }
    });

    // 3. Fetch Data (e.g., Sessions and Pageviews over the last X days)
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${gaPropertyId}`,
      dateRanges: [
        {
          startDate: `${dateRange}daysAgo`,
          endDate: 'today',
        },
      ],
      dimensions: [
        {
          name: 'date',
        },
      ],
      metrics: [
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'activeUsers' },
      ],
      // Sort chronologically
      orderBys: [
        {
          dimension: { dimensionName: 'date' },
          desc: false,
        }
      ]
    });

    // 4. Format the response for the frontend (Chart.js)
    const formattedData = {
      dates: [],
      sessions: [],
      pageViews: [],
      activeUsers: [],
      totals: { sessions: 0, pageViews: 0, activeUsers: 0 }
    };

    if (response.rows && response.rows.length > 0) {
      response.rows.forEach(row => {
        // Format YYYYMMDD to readable date
        const dateString = row.dimensionValues[0].value;
        const formattedDate = `${dateString.substring(0,4)}-${dateString.substring(4,6)}-${dateString.substring(6,8)}`;
        
        const sessions = parseInt(row.metricValues[0].value, 10);
        const pageViews = parseInt(row.metricValues[1].value, 10);
        const activeUsers = parseInt(row.metricValues[2].value, 10);

        formattedData.dates.push(formattedDate);
        formattedData.sessions.push(sessions);
        formattedData.pageViews.push(pageViews);
        formattedData.activeUsers.push(activeUsers);

        // Calculate totals
        formattedData.totals.sessions += sessions;
        formattedData.totals.pageViews += pageViews;
        formattedData.totals.activeUsers += activeUsers;
      });
    }

    // Also get Top 5 Pages
    const [pagesResponse] = await analyticsDataClient.runReport({
      property: `properties/${gaPropertyId}`,
      dateRanges: [{ startDate: `${dateRange}daysAgo`, endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 5
    });

    const topPages = pagesResponse.rows ? pagesResponse.rows.map(row => ({
      path: row.dimensionValues[0].value,
      views: parseInt(row.metricValues[0].value, 10)
    })) : [];

    return new Response(JSON.stringify({ 
      timeline: formattedData,
      topPages
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Analytics fetch error:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to fetch Analytics Data" }), { status: 500 });
  }
}

"use client"

import axios from 'axios';
import { Edit, ImageIcon, Loader2, Plus, Trash2, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner'; // Assuming you are using sonner or similar for toasts

// Components
import BannerCreateModal from '../../../../components/admin/Banner/bannerCreateModal';
import BannerEditModal from '../../../../components/admin/Banner/bannerEditModal';
import { Badge } from '../../../../components/ui/badge';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Skeleton } from '../../../../components/ui/skeleton'; // Install if missing
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../../../../components/ui/alert-dialog"; // Install if missing

export default function BannersPage() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modals State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState(null);
    
    // Delete State
    const [bannerToDelete, setBannerToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Fetch banners
    const fetchBanners = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/banners');
            setBanners(response.data);
        } catch (error) {
            console.error('Error fetching banners:', error);
            toast.error("Failed to load banners");
        } finally {
            setLoading(false);
        }
    };

    // Handle Delete Confirmation
    const confirmDelete = async () => {
        if (!bannerToDelete) return;
        
        try {
            setIsDeleting(true);
            await axios.delete("/api/banners", {
                data: { id: bannerToDelete._id }
            });

            setBanners(prev => prev.filter(b => b._id !== bannerToDelete._id));
            toast.success("Banner deleted successfully");
        } catch (error) {
            console.error('Error deleting banner:', error);
            toast.error("Failed to delete banner");
        } finally {
            setIsDeleting(false);
            setBannerToDelete(null); // Closes the dialog
        }
    };

    const handleBannerCreated = (newBanner) => {
        setBanners([...banners, newBanner]);
        setShowCreateModal(false);
        toast.success("Banner created successfully");
    };

    const handleBannerUpdated = (updatedBanner) => {
        setBanners(banners.map(banner =>
            banner._id === updatedBanner._id ? updatedBanner : banner
        ));
        setShowEditModal(false);
        toast.success("Banner updated successfully");
    };

    const handleEditClick = (banner) => {
        setSelectedBanner(banner);
        setShowEditModal(true);
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    // --- Loading Skeleton ---
    if (loading) {
        return (
            <div className="min-h-screen p-6">
                <div className="mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <Skeleton className="h-8 w-48 mb-2" />
                            <Skeleton className="h-4 w-64" />
                        </div>
                        <Skeleton className="h-10 w-32" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="space-y-3">
                                <Skeleton className="h-48 w-full rounded-lg" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 bg-gray-50/50">
            <div className="mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Banner Management</h1>
                        <p className="text-gray-500 mt-1">Manage the visual highlights of your storefront.</p>
                    </div>
                    <Button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-[#ff6c2f] hover:bg-[#e55a26] text-white shadow-sm transition-all hover:scale-105 active:scale-95"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Banner
                    </Button>
                </div>

                {/* Content */}
                {banners.length === 0 ? (
                    // Empty State
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <div className="w-16 h-16 mx-auto mb-4 bg-orange-50 rounded-full flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-[#ff6c2f]" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No banners active</h3>
                        <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                            Your homepage is currently empty. Create a banner to engage your visitors.
                        </p>
                        <Button
                            onClick={() => setShowCreateModal(true)}
                            variant="outline"
                            className="border-[#ff6c2f] text-[#ff6c2f] hover:bg-[#ff6c2f] hover:text-white"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Now
                        </Button>
                    </div>
                ) : (
                    // Grid State
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {banners.map((banner) => (
                            <Card 
                                key={banner._id} 
                                className="group overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
                            >
                                {/* Image Area */}
                                <div className="aspect-video bg-gray-100 overflow-hidden relative">
                                    <img
                                        src={banner.image || "/placeholder.png"}
                                        alt={banner.heading || "Banner"}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    {/* Overlay Gradient for readability if needed, or status badge */}
                                    <div className="absolute top-2 right-2">
                                        <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm shadow-sm text-xs font-mono">
                                            Position: {banner.position || 'Auto'}
                                        </Badge>
                                    </div>
                                </div>

                                <CardHeader className="pb-3 pt-4">
                                    <CardTitle className="text-lg font-semibold line-clamp-1 leading-tight">
                                        {banner.heading || <span className="text-gray-400 italic">No Heading</span>}
                                    </CardTitle>
                                    <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">
                                        {banner.description || "No description provided."}
                                    </p>
                                </CardHeader>

                                <CardContent className="mt-auto pb-4">
                                    {/* Buttons / Badges */}
                                    <div className="flex flex-wrap gap-2 mb-5 min-h-[24px]">
                                        {banner.buttons?.length > 0 ? banner.buttons.map((button, idx) => (
                                            <Badge
                                                key={idx}
                                                variant="outline"
                                                className={`text-xs px-2 py-0.5 ${
                                                    button.enabled 
                                                        ? 'border-orange-200 bg-orange-50 text-orange-700' 
                                                        : 'border-gray-200 bg-gray-50 text-gray-400'
                                                }`}
                                            >
                                                {button.text}
                                            </Badge>
                                        )) : (
                                            <span className="text-xs text-gray-400 italic">No buttons</span>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleEditClick(banner)}
                                            className="flex-1 hover:bg-gray-50 hover:text-gray-900 border-gray-300"
                                        >
                                            <Edit className="w-3.5 h-3.5 mr-1.5" />
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setBannerToDelete(banner)}
                                            className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                                            Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Create Modal */}
                <BannerCreateModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onBannerCreated={handleBannerCreated}
                />

                {/* Edit Modal */}
                <BannerEditModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    banner={selectedBanner}
                    onBannerUpdated={handleBannerUpdated}
                />

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={!!bannerToDelete} onOpenChange={(open) => !open && setBannerToDelete(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-red-600" />
                                Delete Banner?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete <span className="font-semibold text-gray-900">"{bannerToDelete?.heading}"</span>? 
                                <br />
                                This action cannot be undone and will remove it from the live site immediately.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={(e) => {
                                    e.preventDefault(); // Prevent auto-close to handle async
                                    confirmDelete();
                                }}
                                disabled={isDeleting}
                                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete Banner'
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </div>
        </div>
    );
}
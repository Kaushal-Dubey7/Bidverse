import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, Filter, SlidersHorizontal } from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import AuctionCard from '../../components/bidder/AuctionCard';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';

// Simple debounce utility for search
const useDebounce = (val, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(val);
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedValue(val); }, delay);
    return () => { clearTimeout(handler); };
  }, [val, delay]);
  return debouncedValue;
};

const BrowseAuctions = () => {
    const [auctions, setAuctions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 500);
    const [statusFilter, setStatusFilter] = useState('active'); // active, scheduled, ended, all
    const [sortOption, setSortOption] = useState('endingSoonest'); // endingSoonest, mostBids, newest
    const [categoryFilter, setCategoryFilter] = useState('');

    const categories = ['Fine Art', 'Watches', 'Real Estate', 'Vehicles', 'Collectibles'];

    const fetchAuctions = useCallback(async () => {
        setIsLoading(true);
        try {
            let queryParams = new URLSearchParams();
            if (statusFilter !== 'all') queryParams.append('status', statusFilter);
            if (sortOption) queryParams.append('sort', sortOption);
            if (debouncedSearch) queryParams.append('search', debouncedSearch);
            if (categoryFilter) queryParams.append('category', categoryFilter);

            const response = await api.get(`/auctions?${queryParams.toString()}`);
            setAuctions(response.data?.auctions || []);
        } catch (error) {
            console.error("Error fetching auctions", error);
            // toast error here if needed
        } finally {
            setIsLoading(false);
        }
    }, [statusFilter, sortOption, debouncedSearch, categoryFilter]);

    useEffect(() => {
        fetchAuctions();
    }, [fetchAuctions]);

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-bold font-display tracking-tight text-gradient">Explore Collections</h1>
                    <p className="text-[var(--text-secondary)]">Discover and acquire the most exclusive digital assets.</p>
                </div>
                
                {/* Search Bar */}
                <div className="w-full md:w-[400px]">
                    <Input
                        type="text"
                        placeholder="Search by title, artist, or keyword..."
                        leftIcon={<SearchIcon className="w-4 h-4 text-[var(--accent-primary)]" />}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="rounded-xl border-[var(--glass-border)] bg-[var(--bg-secondary)] shadow-sm focus:shadow-[var(--shadow-glow)] transition-all"
                    />
                </div>
            </div>

            {/* Filters & Actions Bar */}
            <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center p-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full lg:w-auto">
                    {/* Status Tabs */}
                    <div className="flex items-center p-1 bg-[var(--bg-secondary)] rounded-xl border border-[var(--glass-border)] shadow-sm">
                        {['active', 'scheduled', 'all'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setStatusFilter(filter)}
                                className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                                    statusFilter === filter 
                                    ? 'bg-[var(--accent-primary)] text-white shadow-lg' 
                                    : 'text-[var(--text-muted)] hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                    
                    {/* Category Filter */}
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest hidden sm:block">Category:</span>
                        <select 
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="bg-[var(--bg-secondary)] border border-[var(--glass-border)] text-xs font-semibold rounded-xl px-4 py-2.5 outline-none focus:border-[var(--accent-primary)] text-[var(--text-primary)] min-w-[160px] shadow-sm appearance-none cursor-pointer"
                        >
                            <option value="">All Collections</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full lg:w-auto border-t lg:border-t-0 border-[var(--glass-border)] pt-4 lg:pt-0">
                    <div className="flex items-center gap-2 text-[var(--text-muted)]">
                        <SlidersHorizontal className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Sort:</span>
                    </div>
                    <select 
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="bg-transparent text-sm font-bold text-[var(--text-primary)] outline-none border-b-2 border-transparent focus:border-[var(--accent-primary)] pb-1 pr-6 cursor-pointer hover:text-[var(--accent-primary)] transition-colors"
                    >
                        <option value="endingSoonest">Ending Soonest</option>
                        <option value="newest">Recently Added</option>
                        <option value="mostBids">Most Popular</option>
                        <option value="highestPrice">Highest Value</option>
                    </select>
                </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-4">
                <span className="text-xs font-medium text-[var(--text-muted)]">
                    Showing <span className="text-[var(--text-primary)] font-bold">{auctions.length}</span> results
                </span>
            </div>

            {/* Auctions Grid */}
            <div className="min-h-[400px]">
                {isLoading ? (
                    <div className="flex flex-col justify-center items-center h-80 gap-4">
                        <Loader size="lg" />
                        <p className="text-sm text-[var(--text-muted)] animate-pulse">Curating your collection...</p>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {auctions.length > 0 ? (
                            <motion.div 
                                layout
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                            >
                                {auctions.map((auction) => (
                                    <motion.div
                                        key={auction._id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <AuctionCard auction={auction} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }} 
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-24 text-center glass-panel border-dashed border-2"
                            >
                                <div className="w-20 h-20 mb-6 rounded-3xl bg-[var(--bg-tertiary)] flex items-center justify-center shadow-inner">
                                    <SearchIcon className="w-8 h-8 text-[var(--text-muted)] opacity-50" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2 font-display">No matches found</h3>
                                <p className="text-[var(--text-secondary)] max-w-sm mx-auto mb-8">
                                    Your current filters might be too specific. Try clearing some selections or searching for something else.
                                </p>
                                <Button 
                                    variant="secondary" 
                                    onClick={() => {
                                        setSearchTerm('');
                                        setCategoryFilter('');
                                        setSortOption('endingSoonest');
                                        setStatusFilter('active');
                                    }}
                                >
                                    Reset All Filters
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>

    );
};

export default BrowseAuctions;

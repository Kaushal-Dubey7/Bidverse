import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History, ArrowUpRight, Search, Gavel } from 'lucide-react';
import { Link } from 'react-router-dom';

import api from '../../services/api';
import Button from '../../components/common/Button';
import { Card, CardContent } from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';

const MyBids = () => {
    const [bids, setBids] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMyBids = async () => {
            try {
                // Assuming backend has this route implemented to return user's bid history
                const response = await api.get('/bids/my-bids');
                setBids(response.data || []);
            } catch (error) {
                console.error("Error fetching bids", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyBids();
    }, []);

    return (
        <div className="space-y-8 animate-fade-in max-w-[1200px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-secondary)] flex items-center justify-center border border-[var(--glass-border)] shadow-lg group">
                        <History className="w-7 h-7 text-[var(--accent-primary)] group-hover:rotate-[-12deg] transition-transform" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold font-display tracking-tight text-white mb-1">Bidding Portfolio</h1>
                        <p className="text-sm text-[var(--text-muted)] font-medium">An overview of your engagement and acquisition history</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="glass-panel px-4 py-2 border-[var(--glass-border)] flex flex-col items-center">
                        <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Participations</span>
                        <span className="text-lg font-black text-white">{bids.length}</span>
                    </div>
                    <div className="glass-panel px-4 py-2 border-[var(--glass-border)] flex flex-col items-center">
                        <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Won</span>
                        <span className="text-lg font-black text-emerald-500">{bids.filter(b => b.status === 'won').length}</span>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-32">
                    <Loader />
                </div>
            ) : bids.length > 0 ? (
                <Card className="overflow-hidden border-[var(--glass-border)] shadow-2xl bg-black/20 backdrop-blur-md rounded-3xl">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.03] border-b border-[var(--glass-border)]">
                                    <th className="px-8 py-5 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Listing Asset</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] text-right">Commitment</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] text-center">Timestamp</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] text-center">Outcome</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] text-right">Reference</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--glass-border)]">
                                {bids.map((bid, i) => (
                                    <motion.tr 
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        key={bid._id} 
                                        className="hover:bg-white/[0.02] transition-colors group cursor-default"
                                    >
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-xl bg-neutral-900 overflow-hidden border border-white/10 flex-shrink-0 group-hover:scale-105 transition-transform duration-500 shadow-lg">
                                                    {bid.auction?.images?.[0] ? (
                                                        <img src={bid.auction.images[0]} alt="item" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-neutral-800">
                                                            <Gavel className="w-5 h-5 opacity-20" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-bold text-white group-hover:text-[var(--accent-primary)] transition-colors leading-tight">{bid.auction?.title || 'Inactive Listing'}</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-tight">Market:</span>
                                                        <span className="text-[10px] font-bold text-[var(--text-secondary)]">₹{bid.auction?.currentBid?.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="text-lg font-black font-mono text-[var(--credit-amber)] tracking-tighter">₹{bid.amount.toLocaleString()}</span>
                                                <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{bid.amount >= (bid.auction?.currentBid || 0) ? 'Top Priority' : 'Outpaced'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className="text-xs font-bold text-white">{new Date(bid.placedAt).toLocaleDateString()}</span>
                                                <span className="text-[10px] font-medium text-[var(--text-muted)]">{new Date(bid.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <div className="flex justify-center">
                                                {bid.status === 'won' && (
                                                    <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">Victory</div>
                                                )}
                                                {bid.status === 'active' && (
                                                    <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">Participating</div>
                                                )}
                                                {bid.status === 'outbid' && (
                                                    <div className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest">Outbid</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <Link 
                                                to={`/auctions/${bid.auction?._id}`}
                                                className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/5 text-[var(--text-muted)] hover:text-white hover:bg-[var(--accent-primary)] hover:border-[var(--accent-primary)] hover:shadow-lg transition-all"
                                                title="Open Listing"
                                            >
                                                <ArrowUpRight className="w-5 h-5" />
                                            </Link>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 px-8 text-center glass-panel border-dashed border-2 border-[var(--glass-border)] rounded-[2.5rem] bg-black/10">
                    <div className="w-24 h-24 bg-gradient-to-br from-[var(--bg-tertiary)] to-transparent rounded-full flex items-center justify-center mb-8 border border-[var(--glass-border)] shadow-xl">
                        <Gavel className="w-10 h-10 text-[var(--text-muted)] opacity-30" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-3 font-display">No Engagements Yet</h3>
                    <p className="text-[var(--text-secondary)] max-w-[28rem] mx-auto mb-10 text-lg leading-relaxed font-medium">
                        Your bid history is currently clear. Dive into the marketplace and secure your first asset today.
                    </p>
                    <Button 
                        as={Link} 
                        to="/browse" 
                        variant="gradient"
                        size="lg"
                        className="px-10 rounded-2xl shadow-[var(--shadow-glow)] uppercase tracking-widest font-black text-sm"
                    >
                        Explore Auctions
                    </Button>
                </div>
            )}
        </div>
    );
};

export default MyBids;

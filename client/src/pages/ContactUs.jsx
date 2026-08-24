import Footer from '../components/Footer';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

const ContactUs = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            return toast.error('Please fill in all required fields');
        }
        setSubmitted(true);
        toast.success('Your message has been sent to our team!');
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pt-6 pb-10">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

                {/* Hero */}
                <div className="text-center max-w-2xl mx-auto pt-8">
                    <span className="text-xs font-bold text-[#a11c5e] bg-pink-50 border border-pink-200 px-4 py-1.5 rounded-full uppercase tracking-wider">
                        Contact Support
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
                        We’re Here to Help You Succeed
                    </h1>
                    <p className="text-slate-600 text-sm sm:text-base mt-2">
                        Have questions about listing your startup, plan billing, or verified buyer access? Get in touch with us.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Contact Info Sidebar */}
                    <div className="space-y-4">
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="size-10 bg-pink-50 text-[#a11c5e] rounded-xl flex items-center justify-center shrink-0">
                                <Mail className="size-5" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-semibold uppercase">Email Us</p>
                                <p className="text-sm font-bold text-slate-800">support@venturehub.com</p>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="size-10 bg-pink-50 text-[#a11c5e] rounded-xl flex items-center justify-center shrink-0">
                                <Phone className="size-5" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-semibold uppercase">Call Support</p>
                                <p className="text-sm font-bold text-slate-800">+91 xxxxxxxxxx<br></br>+91 xxxxxxxxxx </p>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="size-10 bg-pink-50 text-[#a11c5e] rounded-xl flex items-center justify-center shrink-0">
                                <MapPin className="size-5" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-semibold uppercase">Head Office</p>
                                <p className="text-xs font-semibold text-slate-800">Koramangala 4th Block, Bangalore, KA 560034</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="md:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                        {submitted ? (
                            <div className="py-12 text-center space-y-3">
                                <div className="size-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                                    <CheckCircle className="size-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Message Received!</h3>
                                <p className="text-sm text-slate-600 max-w-sm mx-auto">
                                    Thank you for reaching out. Our support team will get back to you within 24 business hours.
                                </p>
                                <button onClick={() => setSubmitted(false)} className="text-xs font-bold text-[#a11c5e] hover:underline pt-2">
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <h2 className="text-lg font-bold text-slate-900 mb-2">Send us a message</h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 block mb-1">Your Name *</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full text-sm px-3.5 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#a11c5e] focus:ring-2 focus:ring-pink-100 text-slate-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 block mb-1">Your Email *</label>
                                        <input
                                            type="email"
                                            required
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full text-sm px-3.5 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#a11c5e] focus:ring-2 focus:ring-pink-100 text-slate-700"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Subject</label>
                                    <input
                                        type="text"
                                        placeholder="Listing question, pricing inquiry..."
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full text-sm px-3.5 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#a11c5e] focus:ring-2 focus:ring-pink-100 text-slate-700"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Message *</label>
                                    <textarea
                                        required
                                        rows={4}
                                        placeholder="How can we help you?"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full text-sm px-3.5 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#a11c5e] focus:ring-2 focus:ring-pink-100 text-slate-700 resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full sm:w-auto bg-gradient-to-r from-[#702371] via-[#a11c5e] to-[#442077] text-white font-bold text-sm px-8 py-3 rounded-xl hover:opacity-95 shadow-md shadow-pink-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <Send className="size-4" />
                                    <span>Send Message</span>
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ContactUs;

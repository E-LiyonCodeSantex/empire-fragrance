import { useEffect, useState } from "react";
import api from "@/utils/axiosInstance";
import { ShippingRule } from "@/interface";
import Head from "next/head";


export default function ShippingRulesPage() {
    const [rules, setRules] = useState<ShippingRule[]>([]);
    const [form, setForm] = useState({ state: "", price: 2000, freeShippingThreshold: "" });
    const [editingId, setEditingId] = useState<string | null>(null);

    // Fetch rules
    useEffect(() => {
        (async () => {
            const { data } = await api.get<ShippingRule[]>("/api/admin/shipping-rules");
            setRules(data);
        })();
    }, []);

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                const { data } = await api.put<ShippingRule>(`/api/admin/shipping-rules/${editingId}`, form);
                setRules(rules.map(r => (r._id === editingId ? data : r)));
                setEditingId(null);
            } else {
                const { data } = await api.post<ShippingRule>("/api/admin/shipping-rules", form);
                setRules([...rules, data]);
            }
            setForm({ state: "", price: 2000, freeShippingThreshold: "" });
        } catch (err: any) {
            alert(err?.response?.data?.message || "Error saving rule");
        }
    };

    // Handle delete
    const handleDelete = async (id: string) => {
        if (!confirm("Delete this rule?")) return;
        await api.delete(`/api/admin/shipping-rules/${id}`);
        setRules(rules.filter(r => r._id !== id));
    };

    // Handle edit
    const handleEdit = (rule: ShippingRule) => {
        setForm({
            state: rule.state,
            price: rule.price,
            freeShippingThreshold: rule.freeShippingThreshold?.toString() || "",
        });
        setEditingId(rule._id);
    };

    return (
        <>
            <Head>
                <title>Admin | Orders Dashboard</title>
            </Head>

            <main className="px-4 pt-16 pb-6 text-gray-700">
                <h1 className="text-xl font-bold mb-4">Shipping Rules</h1>

                <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                    <input
                        type="text"
                        placeholder="State"
                        value={form.state}
                        onChange={e => setForm({ ...form, state: e.target.value })}
                        className="p-2 w-full outline-none border border-gray-400 rounded-lg"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={form.price}
                        onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                        className="p-2 w-full outline-none border border-gray-400 rounded-lg"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Free Shipping Threshold (optional)"
                        value={form.freeShippingThreshold}
                        onChange={e => setForm({ ...form, freeShippingThreshold: e.target.value })}
                        className="p-2 w-full outline-none border border-gray-400 rounded-lg"
                    />
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                        {editingId ? "Update Rule" : "Add Rule"}
                    </button>
                </form>

                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border border-gray-400">State</th>
                            <th className="p-2 border border-gray-400">Price</th>
                            <th className="p-2 border border-gray-400">Free Shipping Threshold</th>
                            <th className="p-2 border border-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {rules.map(rule => (
                            <tr key={rule._id}>
                                <td className="p-2 border border-gray-400">{rule.state}</td>
                                <td className="p-2 border border-gray-400">₦{rule.price}</td>
                                <td className="p-2 border border-gray-400">{rule.freeShippingThreshold || "-"}</td>
                                <td className="p-2 border border-gray-400 space-x-2">
                                    <button onClick={() => handleEdit(rule)} className="text-blue-600">Edit</button>
                                    <button onClick={() => handleDelete(rule._id)} className="text-red-600">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
        </>
    );
}

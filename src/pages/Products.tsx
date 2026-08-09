import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Product {
  id: string;
  sku: string;
  title: string;
  price: number;
  attributes: Record<string, unknown>;
}

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) console.error('Error loading products:', error);
      else setProducts(data || []);

      setLoading(false);
    };

    fetchProducts();
  }, []);

  const renderContent = () => {
    if (loading) return <p className="text-zinc-500">Loading...</p>;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products?.map((prod) => (
          <div
            key={prod.id}
            className="bg-zinc-900 border border-zinc-800 p-5 rounded-lg"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg text-zinc-100">
                {prod.title}
              </h3>
              <span className="text-emerald-400 font-bold">${prod.price}</span>
            </div>
            <p className="text-xs text-zinc-500 mb-4">SKU: {prod.sku}</p>

            <div className="bg-zinc-950 p-3 rounded border border-zinc-800/60 text-xs font-mono text-zinc-400">
              <p className="text-zinc-500 mb-1">&gt;&gt; Especifications</p>
              {Object.entries(prod.attributes).map(([key, val]) => (
                <div key={key} className="flex justify-between py-0.5">
                  <span className="text-zinc-400">{key}:</span>
                  <span className="text-emerald-400/90">{String(val)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-zinc-800">Products</h1>
        <button className="bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-semibold px-4 py-2 rounded-md text-sm transition-colors">
          + Add
        </button>
      </div>

      {renderContent()}
    </div>
  );
}

export default ProductsPage;

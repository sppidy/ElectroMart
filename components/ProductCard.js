export default function ProductCard({ title, price }) {
    return (
      <div className="border rounded-lg p-4 shadow-md">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-lg text-gray-700">{price}</p>
        <button className="mt-2 px-4 py-2 bg-purple-900 text-white rounded-md">
          Buy Now
        </button>
      </div>
    );
}
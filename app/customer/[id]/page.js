export default async function CustomerDetail({ params }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  const data = await fetch(`${API_BASE}/customer/${params.id}`, { cache: "no-store" });
  const customer = await data.json();

  return (
    <div className="m-4">
      <h1>Customer</h1>
      <p className="font-bold text-xl text-blue-800">{customer.name}</p>
      <p>Date of Birth: {new Date(customer.dob).toLocaleDateString()}</p>
      <p>Member Number: {customer.memberNumber}</p>
      <p>Interests: {customer.interests}</p>
    </div>
  );
}

"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

export default function CustomerManagement() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const { register, handleSubmit, reset } = useForm();
  const [customers, setCustomers] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const startEdit = (customer) => async () => {
    setEditMode(true);
    reset(customer);
  };

  async function fetchCustomers() {
    const data = await fetch(`${API_BASE}/customer`);
    const customers = await data.json();
    setCustomers(customers);
  }

  const createOrUpdateCustomer = async (data) => {
    const method = editMode ? "PUT" : "POST";
    const url = `${API_BASE}/customer`;
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      alert(`Failed to ${editMode ? "update" : "add"} customer: ${response.status}`);
    } else {
      alert(`Customer ${editMode ? "updated" : "added"} successfully`);
      reset({
        name: "",
        dob: "",
        memberNumber: "",
        interests: "",
      });
      setEditMode(false);
      fetchCustomers();
    }
  };

  const deleteById = (id) => async () => {
    if (!confirm("Are you sure?")) return;

    const response = await fetch(`${API_BASE}/customer/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      alert(`Failed to delete customer: ${response.status}`);
    } else {
      alert("Customer deleted successfully");
      fetchCustomers();
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="flex flex-row gap-4">
      <div className="flex-1 w-64 ">
        <form onSubmit={handleSubmit(createOrUpdateCustomer)}>
          <div className="grid grid-cols-2 gap-4 m-4 w-1/2">
            <div>Name:</div>
            <div>
              <input
                name="name"
                type="text"
                {...register("name", { required: true })}
                className="border border-black w-full"
              />
            </div>
            <div>Date of Birth:</div>
            <div>
              <input
                name="dob"
                type="date"
                {...register("dob", { required: true })}
                className="border border-black w-full"
              />
            </div>
            <div>Member Number:</div>
            <div>
              <input
                name="memberNumber"
                type="number"
                {...register("memberNumber", { required: true })}
                className="border border-black w-full"
              />
            </div>
            <div>Interests:</div>
            <div>
              <input
                name="interests"
                type="text"
                {...register("interests", { required: false })}
                className="border border-black w-full"
              />
            </div>
            <div className="col-span-2">
              {editMode ? (
                <input
                  type="submit"
                  value="Update"
                  className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                />
              ) : (
                <input
                  type="submit"
                  value="Add"
                  className="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                />
              )}
              {editMode && (
                <button
                  onClick={() => {
                    reset({ name: "", dob: "", memberNumber: "", interests: "" });
                    setEditMode(false);
                  }}
                  className="ml-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
      <div className="border m-4 bg-slate-300 flex-1 w-64">
        <h1 className="text-2xl mb-4">Customers ({customers.length})</h1>
        <table className="table-auto w-full border border-collapse border-black">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-black px-4 py-2">Name</th>
              <th className="border border-black px-4 py-2">Date of Birth</th>
              <th className="border border-black px-4 py-2">Member Number</th>
              <th className="border border-black px-4 py-2">Interests</th>
              <th className="border border-black px-4 py-2">Update</th>
              <th className="border border-black px-4 py-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id}>
                <td className="border border-black px-4 py-2">
                  <Link href={`/customer/${customer._id}`} className="font-bold">
                    {customer.name}
                  </Link>
                </td>
                <td className="border border-black px-4 py-2">{new Date(customer.dob).toLocaleDateString()}</td>
                <td className="border border-black px-4 py-2">{customer.memberNumber}</td>
                <td className="border border-black px-4 py-2">{customer.interests}</td>
                <td className="border border-black px-4 py-2">
                  <button className="bg-blue-500 text-white p-2 rounded" onClick={startEdit(customer)}>
                    📝 Update
                  </button>
                </td>
                <td className="border border-black px-4 py-2">
                  <button className="bg-red-500 text-white p-2 rounded" onClick={deleteById(customer._id)}>
                   🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

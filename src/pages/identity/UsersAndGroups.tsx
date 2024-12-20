import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DataTable from '../../components/tables/DataTable';
import { fetchUsers, type Profile } from '../../services/userService';

export default function UsersAndGroups() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { 
      header: 'Name',
      accessor: (user: Profile) => `${user.first_name} ${user.last_name}`,
      sortable: true
    },
    { header: 'Email', accessor: 'email', sortable: true },
    { 
      header: 'Role', 
      accessor: (user: Profile) => (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          {user.role}
        </span>
      ),
      sortable: true,
      sortAccessor: (user: Profile) => user.role
    },
    { 
      header: 'Created At', 
      accessor: (user: Profile) => new Date(user.created_at).toLocaleDateString(),
      sortable: true,
      sortAccessor: (user: Profile) => user.created_at
    }
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const users = await fetchUsers();
      setUsers(users);
    } catch (error: any) {
      toast.error('Error fetching users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Users & Groups</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <DataTable columns={columns} data={users} />
      </div>
    </div>
  );
}
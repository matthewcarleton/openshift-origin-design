import { useState } from "react";
import { Users, UserCog, Search, RefreshCw } from "@/lib/pfIcons";
import Breadcrumbs from "../components/Breadcrumbs";
import FavoriteButton from "../components/FavoriteButton";
import { usePermissions } from "../contexts/PermissionsContext";
import ImpersonateUserModal from "../components/ImpersonateUserModal";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  lastLogin: string;
  status: "Active" | "Inactive";
}

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isImpersonateModalOpen, setIsImpersonateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { impersonatedUser, setImpersonatedUser } = usePermissions();

  const users: User[] = [
    { id: "1", name: "Sarah Johnson", email: "sarah.johnson@redhat.com", role: "Cluster Admin", department: "Platform Engineering", lastLogin: "2 hours ago", status: "Active" },
    { id: "2", name: "Michael Chen", email: "michael.chen@redhat.com", role: "Developer", department: "Application Development", lastLogin: "5 hours ago", status: "Active" },
    { id: "3", name: "Emily Rodriguez", email: "emily.rodriguez@redhat.com", role: "Viewer", department: "Quality Assurance", lastLogin: "1 day ago", status: "Active" },
    { id: "4", name: "David Kim", email: "david.kim@redhat.com", role: "Developer", department: "Application Development", lastLogin: "3 hours ago", status: "Active" },
    { id: "5", name: "Lisa Anderson", email: "lisa.anderson@redhat.com", role: "Cluster Admin", department: "Platform Engineering", lastLogin: "30 minutes ago", status: "Active" },
    { id: "6", name: "James Wilson", email: "james.wilson@redhat.com", role: "Viewer", department: "Business Analysis", lastLogin: "2 days ago", status: "Active" },
  ];

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "Cluster Admin").length,
    developers: users.filter((u) => u.role === "Developer").length,
    viewers: users.filter((u) => u.role === "Viewer").length,
  };

  const handleImpersonate = (user: User) => {
    setSelectedUser(user);
    setIsImpersonateModalOpen(true);
  };

  const confirmImpersonate = (user: { id: string; name: string; email: string; role: string; department: string }) => {
    setImpersonatedUser(user);
    setIsImpersonateModalOpen(false);
  };

  return (
    <div className="ocs-app-page-outer w-full">
      <Breadcrumbs
        items={[
          { label: "Home", path: "/" },
          { label: "User Management", path: "/user-management" },
        ]}
      >

      <div className="flex items-center justify-between mb-[24px]">
        <div>
          <h1 className="font-['Red_Hat_Display_VF:Medium',sans-serif] font-medium leading-[36.4px] text-[#151515] dark:text-white text-[28px] mb-[8px]">
            User Management
          </h1>
          <p className="text-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]">
            Manage users, roles, and permissions across the cluster
          </p>
        </div>
        <div className="flex items-center gap-[12px]">
          <FavoriteButton name="User Management" path="/user-management" />
        </div>
      </div>

      {/* Current Impersonation Banner */}
      {impersonatedUser && (
        <div className="bg-[#fff4e5] dark:bg-[rgba(255,152,0,0.15)] border border-[#ff9800] dark:border-[rgba(255,152,0,0.3)] rounded-[12px] p-[16px] mb-[24px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[12px]">
              <UserCog className="size-[20px] text-[#ff9800] dark:text-[#ffb74d]" />
              <div>
                <p className="text-[14px] font-semibold text-[#151515] dark:text-white">
                  Currently impersonating: {impersonatedUser.name}
                </p>
                <p className="text-[12px] text-[#4d4d4d] dark:text-[#b0b0b0]">
                  {impersonatedUser.role} • {impersonatedUser.department}
                </p>
              </div>
            </div>
            <button
              onClick={() => setImpersonatedUser(null)}
              className="px-[16px] py-[8px] bg-[#d32f2f] hover:bg-[#b71c1c] text-white rounded-[8px] text-[14px] font-semibold transition-colors"
            >
              Stop Impersonation
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-[16px] mb-[24px]">
        <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <Users className="size-[20px] text-[#0066cc] dark:text-[#4dabf7]" />
            <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">Total Users</p>
          </div>
          <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[28px] text-[#151515] dark:text-white">{stats.total}</p>
        </div>
        <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <UserCog className="size-[20px] text-[#d32f2f] dark:text-[#ef5350]" />
            <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">Cluster Admins</p>
          </div>
          <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[28px] text-[#151515] dark:text-white">{stats.admins}</p>
        </div>
        <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <Users className="size-[20px] text-[#3e8635] dark:text-[#81c784]" />
            <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">Developers</p>
          </div>
          <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[28px] text-[#151515] dark:text-white">{stats.developers}</p>
        </div>
        <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] p-[20px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <Users className="size-[20px] text-[#ff9800] dark:text-[#ffb74d]" />
            <p className="text-[13px] text-[#4d4d4d] dark:text-[#b0b0b0]">Viewers</p>
          </div>
          <p className="font-['Red_Hat_Display:SemiBold',sans-serif] font-semibold text-[28px] text-[#151515] dark:text-white">{stats.viewers}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] p-[20px] mb-[16px]">
        <div className="flex items-center gap-[16px]">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 size-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]" />
              <input
                type="text"
                placeholder="Search users by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-[40px] pr-[12px] py-[10px] bg-white dark:bg-[#1a1a1a] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] rounded-[8px] text-[14px] text-[#151515] dark:text-white placeholder:text-[#4d4d4d] dark:placeholder:text-[#b0b0b0] focus:outline-none focus:ring-2 focus:ring-[#0066cc] dark:focus:ring-[#4dabf7]"
              />
            </div>
          </div>
          <button className="p-[10px] hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.05)] rounded-[8px] transition-colors">
            <RefreshCw className="size-[16px] text-[#4d4d4d] dark:text-[#b0b0b0]" />
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] rounded-[12px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.06)] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.02)] border-b border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)]">
            <tr>
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">USER</th>
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">ROLE</th>
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">DEPARTMENT</th>
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">LAST LOGIN</th>
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">STATUS</th>
              <th className="text-left px-[20px] py-[12px] text-[13px] font-semibold text-[#4d4d4d] dark:text-[#b0b0b0]">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] hover:bg-[rgba(0,0,0,0.02)] dark:hover:bg-[rgba(255,255,255,0.02)] transition-colors"
              >
                <td className="px-[20px] py-[16px]">
                  <div>
                    <p className="text-[14px] text-[#151515] dark:text-white font-semibold">{user.name}</p>
                    <p className="text-[12px] text-[#4d4d4d] dark:text-[#b0b0b0]">{user.email}</p>
                  </div>
                </td>
                <td className="px-[20px] py-[16px]">
                  <span className={`px-[10px] py-[4px] rounded-[999px] text-[12px] font-semibold ${
                    user.role === "Cluster Admin"
                      ? "text-[#d32f2f] dark:text-[#ef5350] bg-[#ffebee] dark:bg-[rgba(211,47,47,0.15)]"
                      : user.role === "Developer"
                      ? "text-[#3e8635] dark:text-[#81c784] bg-[#e8f5e9] dark:bg-[rgba(62,134,53,0.15)]"
                      : "text-[#ff9800] dark:text-[#ffb74d] bg-[#fff4e5] dark:bg-[rgba(255,152,0,0.15)]"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-[20px] py-[16px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">{user.department}</td>
                <td className="px-[20px] py-[16px] text-[14px] text-[#4d4d4d] dark:text-[#b0b0b0]">{user.lastLogin}</td>
                <td className="px-[20px] py-[16px]">
                  <span className="px-[10px] py-[4px] rounded-[999px] text-[12px] font-semibold text-[#3e8635] dark:text-[#81c784] bg-[#e8f5e9] dark:bg-[rgba(62,134,53,0.15)]">
                    {user.status}
                  </span>
                </td>
                <td className="px-[20px] py-[16px]">
                  <button
                    onClick={() => handleImpersonate(user)}
                    className="px-[12px] py-[6px] bg-[#0066cc] hover:bg-[#004080] dark:bg-[#4dabf7] dark:hover:bg-[#339af0] text-white rounded-[999px] text-[12px] font-semibold transition-colors"
                  >
                    Impersonate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </Breadcrumbs>

      {/* Impersonate Modal */}
      {isImpersonateModalOpen && selectedUser && (
        <ImpersonateUserModal
          onClose={() => setIsImpersonateModalOpen(false)}
          onImpersonate={confirmImpersonate}
          users={users}
          preselectedUser={selectedUser}
        />
      )}
    </div>
  );
}
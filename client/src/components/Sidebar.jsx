import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  /*{
    to: "/analytics",
    label: "Analytics",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },*/
  {
    to: "/create",
    label: "New URL",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v16m8-8H4" />
      </svg>
    ),
    highlight: true,
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out
          bg-[#0d1322] border-r border-[#1e2d45] z-40
          ${collapsed ? "w-16" : "w-60"}`}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-5 h-16 border-b border-[#1e2d45] flex-shrink-0 ${collapsed ? "justify-center px-0" : ""}`}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00d4aa] to-[#0095ff] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#00d4aa]/20">
            <svg className="w-4 h-4 text-[#080c14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m.83-5.656a4 4 0 015.656 0l1 1a4 4 0 01-5.657 5.657l-1-1" />
            </svg>
          </div>
          {!collapsed && (
            <span className="font-bold text-[#f0f4ff] text-lg tracking-tight">TinySeed</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 flex flex-col gap-1 overflow-y-auto">
          {!collapsed && (
            <p className="text-[10px] font-semibold text-[#4a5a76] uppercase tracking-widest px-3 mb-3">
              Main Menu
            </p>
          )}
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 h-10 text-sm font-medium transition-all duration-200
                 ${collapsed ? "justify-center" : ""}
                 ${isActive ? "nav-active" : "nav-inactive"}`
              }
              title={collapsed ? item.label : undefined}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.highlight && (
                <span className="ml-auto w-2 h-2 rounded-full bg-[#00d4aa] shadow-[0_0_6px_rgba(0,212,170,0.8)]" />
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-5 border-t border-[#1e2d45] pt-4 flex flex-col gap-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`flex items-center gap-3 rounded-xl px-3 h-9 text-sm text-[#4a5a76] hover:text-[#8b9cba] hover:bg-[#111827] transition-all duration-200 ${collapsed ? "justify-center" : ""}`}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
            {!collapsed && <span>Collapse</span>}
          </button>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 rounded-xl px-3 h-9 text-sm text-[#4a5a76] hover:text-[#f87171] hover:bg-[#f87171]/5 transition-all duration-200 ${collapsed ? "justify-center" : ""}`}
            title={collapsed ? "Logout" : undefined}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0d1322]/95 backdrop-blur-xl border-t border-[#1e2d45] px-2 pb-safe">
        <div className="flex items-center justify-around h-16">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200
                 ${isActive ? "text-[#00d4aa]" : "text-[#4a5a76] hover:text-[#8b9cba]"}`
              }
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-[#4a5a76] hover:text-[#f87171] transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-[10px] font-medium">Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
}

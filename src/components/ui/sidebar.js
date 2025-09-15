import React, { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

const Sidebar = ({ children, className = "" }) => {
  const { isOpen } = useSidebar();

  return (
    <div
      className={`${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${className}`}
    >
      {children}
    </div>
  );
};

const SidebarHeader = ({ children, className = "" }) => (
  <div className={`border-b border-gray-200 ${className}`}>{children}</div>
);

const SidebarContent = ({ children, className = "" }) => (
  <div className={`flex-1 overflow-y-auto ${className}`}>{children}</div>
);

const SidebarGroup = ({ children, className = "" }) => (
  <div className={`${className}`}>{children}</div>
);

const SidebarGroupLabel = ({ children, className = "" }) => (
  <div
    className={`px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider ${className}`}
  >
    {children}
  </div>
);

const SidebarGroupContent = ({ children, className = "" }) => (
  <div className={`${className}`}>{children}</div>
);

const SidebarMenu = ({ children, className = "" }) => (
  <ul className={`space-y-1 ${className}`}>{children}</ul>
);

const SidebarMenuItem = ({ children, className = "" }) => (
  <li className={`${className}`}>{children}</li>
);

const SidebarMenuButton = ({
  children,
  className = "",
  asChild = false,
  ...props
}) => {
  if (asChild) {
    return React.cloneElement(children, {
      className: `${children.props.className || ""} ${className}`,
    });
  }

  return (
    <button
      className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const SidebarTrigger = ({ children, className = "", ...props }) => {
  const { setIsOpen } = useSidebar();

  return (
    <button
      className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${className}`}
      onClick={() => setIsOpen((prev) => !prev)}
      {...props}
    >
      {children}
    </button>
  );
};

export {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
};

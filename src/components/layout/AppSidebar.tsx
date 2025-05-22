
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup,
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem 
} from "@/components/ui/sidebar";
import { 
  FileText, 
  BarChart, 
  User, 
  Settings, 
  BookOpen, 
  Briefcase,
  HelpCircle,
  Video,
  LogOut,
  Plus
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser, useClerk } from "@clerk/clerk-react";
import { cn } from "@/lib/utils";

interface MenuItem {
  title: string;
  icon: React.ElementType;
  path: string;
}

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useUser();
  const { signOut } = useClerk();

  const mainMenuItems: MenuItem[] = [
    { title: "Dashboard", icon: BarChart, path: "/dashboard" },
    { title: "Resumes", icon: FileText, path: "/dashboard/resumes" },
    { title: "Job Board", icon: Briefcase, path: "/dashboard/jobs" },
    { title: "Interview Practice", icon: Video, path: "/dashboard/interview" },
    { title: "Learning", icon: BookOpen, path: "/dashboard/learning" },
    { title: "Profile", icon: User, path: "/dashboard/profile" },
    { title: "Settings", icon: Settings, path: "/dashboard/settings" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || 
           (path !== '/dashboard' && location.pathname.startsWith(path));
  };

  const handleNavigation = (path: string) => {
    // Check if the path exists in our routes
    const validPaths = [
      "/dashboard", 
      "/dashboard/resumes", 
      "/dashboard/resumes/new",
      "/dashboard/jobs", 
      "/dashboard/interview"
    ];
    
    if (validPaths.includes(path)) {
      navigate(path);
    } else {
      toast({
        title: "Coming Soon",
        description: `The ${path.split("/").pop()} feature is coming soon.`,
      });
    }
  };

  const handleLogout = () => {
    signOut().then(() => {
      toast({
        title: "Logged out",
        description: "You've been successfully logged out.",
      });
      navigate("/");
    });
  };

  const handleCreateNewResume = () => {
    navigate("/dashboard/resumes/new");
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src={user?.imageUrl || ""} />
            <AvatarFallback>{user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{user?.fullName || "User"}</p>
            <p className="text-xs text-muted-foreground">{user?.emailAddresses[0]?.emailAddress || "user@example.com"}</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      onClick={() => handleNavigation(item.path)}
                      className={cn(isActive(item.path) && "bg-accent text-accent-foreground")}
                    >
                      <div role="button" className="flex cursor-pointer items-center">
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild onClick={handleCreateNewResume}>
                    <div role="button" className="flex cursor-pointer items-center text-primary">
                      <Plus className="mr-2 h-4 w-4" />
                      <span>Create New Resume</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarGroup>
            <SidebarGroupLabel>Support</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <div role="button" className="flex cursor-pointer items-center">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      <span>Help & Resources</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
      
      <SidebarFooter>
        <Button 
          variant="ghost" 
          className="w-full flex items-center justify-start"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

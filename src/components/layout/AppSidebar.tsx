
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
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MenuItem {
  title: string;
  icon: React.ElementType;
  path: string;
}

export function AppSidebar() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const mainMenuItems: MenuItem[] = [
    { title: "Dashboard", icon: BarChart, path: "/dashboard" },
    { title: "Resumes", icon: FileText, path: "/dashboard/resumes" },
    { title: "Job Board", icon: Briefcase, path: "/dashboard/jobs" },
    { title: "Learning", icon: BookOpen, path: "/dashboard/learning" },
    { title: "Profile", icon: User, path: "/dashboard/profile" },
    { title: "Settings", icon: Settings, path: "/dashboard/settings" },
  ];

  const handleNavigation = (path: string) => {
    // For demo purposes, show a toast instead of navigating for most pages
    if (path === "/dashboard") {
      navigate(path);
    } else {
      toast({
        title: "Navigation",
        description: `Navigating to ${path} would happen here.`,
      });
    }
  };

  const handleLogout = () => {
    toast({
      title: "Logging out",
      description: "You would be logged out here.",
    });
    navigate("/");
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">User Name</p>
            <p className="text-xs text-muted-foreground">user@example.com</p>
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
                    <SidebarMenuButton asChild onClick={() => handleNavigation(item.path)}>
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

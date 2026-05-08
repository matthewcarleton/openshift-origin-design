import { Outlet } from "react-router";
import { ChatProvider } from "../contexts/ChatContext";
import { PermissionsProvider } from "../contexts/PermissionsContext";
import { FavoritesProvider } from "../contexts/FavoritesContext";
import { ClusterUpdateDemoProvider } from "../contexts/ClusterUpdateDemoContext";
import LightSpeedGlobalMount from "./LightSpeedGlobalMount";

export default function RootLayout() {
  return (
    <PermissionsProvider>
      <ChatProvider>
        <FavoritesProvider>
          <ClusterUpdateDemoProvider>
            <Outlet />
            <LightSpeedGlobalMount />
          </ClusterUpdateDemoProvider>
        </FavoritesProvider>
      </ChatProvider>
    </PermissionsProvider>
  );
}
/// Navigation menu items for different users
export const DefaultNav = [
   {
      id: 0,
      path: "/",
      displayName: "Home",
   },
   {
      id: 1,
      path: "/Login",
      displayName: "Login",
   },
   {
      id: 2,
      path: "/Role",
      displayName: "Role",
   },
   {
      id: 3,
      path: "/User",
      displayName: "User",
   }
];

export const LoginNav = [
   {
      id: 0,
      path: "/Shop",
      displayName: "Shop",
   }
];

export declare type INavItem = {
   id: number,
   path: string,
   displayName: string,
};
import { ChakraProvider } from "@chakra-ui/react";
import { RouterProvider } from "react-router-dom";
import "./i18n";
import { useRouter } from "./router";
import { RecoilRoot } from "recoil";
function App() {
  const router = useRouter();

  return (
    <RecoilRoot>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </RecoilRoot>
  );
}

export default App;

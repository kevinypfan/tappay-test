import {
  Box,
  Flex,
  Heading,
  HStack,
  Link,
  Stack,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { CartItem } from "./CartItem";
import { CartOrderSummary } from "./CartOrderSummary";
import { useRecoilState } from "recoil";
import { orderState } from "../store/order";

export const ShoppingCart = () => {
  const [order, setOrder] = useRecoilState(orderState);

  const qtyHandler = (id: string, qty: number) => {
    setOrder((prev) => {
      const temp = [...prev];
      const index = prev.findIndex((el) => el.id === id);
      temp[index].quantity = qty;
      temp[index].total = temp[index].price * qty;
      return temp;
    });
  };

  const getTotalPrice = () => {
    return order.map((o) => o.total).reduce((a, b) => a + b, 0);
  };

  return (
    <Box
      maxW={{ base: "3xl", lg: "7xl" }}
      mx="auto"
      px={{ base: "4", md: "8", lg: "12" }}
      py={{ base: "6", md: "8", lg: "12" }}
    >
      <Stack
        direction={{ base: "column", lg: "row" }}
        align={{ lg: "flex-start" }}
        spacing={{ base: "8", md: "16" }}
      >
        <Stack spacing={{ base: "8", md: "10" }} flex="2">
          <Heading fontSize="2xl" fontWeight="extrabold">
            Shopping Cart (3 items)
          </Heading>

          <Stack spacing="6">
            {order.map((item) => (
              <CartItem
                key={item.id}
                {...item}
                onChangeQuantity={(qty: number) => qtyHandler(item.id, qty)}
              />
            ))}
          </Stack>
        </Stack>

        <Flex direction="column" align="center" flex="1">
          <CartOrderSummary total={getTotalPrice()} />
          <HStack mt="6" fontWeight="semibold">
            <p>or</p>
            <Link color={mode("blue.500", "blue.200")}>Continue shopping</Link>
          </HStack>
        </Flex>
      </Stack>
    </Box>
  );
};

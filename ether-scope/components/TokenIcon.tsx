import { Image, View, Text } from "react-native";
import { TOKEN_LOGOS } from "@/lib/tokenLogos";

export default function TokenIcon({ symbol }: { symbol: string }) {
  const logo = TOKEN_LOGOS[symbol?.toUpperCase()];

  if (logo) {
    return (
      <Image
        source={logo}
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
        }}
      />
    );
  }

  // fallback if logo doesn't exist
  return (
    <View
      style={{
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#2563eb",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "white", fontWeight: "bold" }}>
        {symbol?.slice(0, 2)}
      </Text>
    </View>
  );
}
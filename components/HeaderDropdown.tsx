import Colors from "@/constants/Colors";
import { SFSymbol } from "expo-symbols";
import { StyleSheet, Text, View } from "react-native";
import * as DropdownMenu from "zeego/dropdown-menu";

export type HeaderDropdownProps = {
  title: string;
  selected?: string;
  onSelect: (key: string) => void;
  items: Array<{
    key: string;
    title: string;
    icon: SFSymbol;
  }>;
};

const HeaderDropdown = ({
  title,
  selected,
  onSelect,
  items,
}: HeaderDropdownProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.title}>{title}</Text>

          {selected && (
            <Text style={styles.selectedTitle}>{selected} &gt;</Text>
          )}
        </View>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        {items.map((item) => (
          <DropdownMenu.Item key={item.key} onSelect={() => onSelect(item.key)}>
            <DropdownMenu.ItemTitle>{item.title}</DropdownMenu.ItemTitle>
            <DropdownMenu.ItemIcon ios={{ name: item.icon, pointSize: 20 }} />
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: "500",
  },
  selectedTitle: {
    marginLeft: 4,
    color: Colors.greyLight,
    fontSize: 16,
    fontWeight: "500",
  },
});
export default HeaderDropdown;

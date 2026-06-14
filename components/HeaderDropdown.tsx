import Colors from "@/constants/Colors";
import { Model } from "@/util/interfaces";
import { StyleSheet, Text, View } from "react-native";
import * as DropdownMenu from "zeego/dropdown-menu";

export type HeaderDropdownProps = {
  selected?: Model;
  onSelect: (model: Model) => void;
  items: Model[];
};

const HeaderDropdown = ({ selected, onSelect, items }: HeaderDropdownProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.title}>
            {selected ? `${selected.title}: ` : "Select Model"}
          </Text>

          {selected && (
            <Text style={styles.selectedTitle}>{selected.subTitle} &gt;</Text>
          )}
        </View>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        {items.map((item) => (
          <DropdownMenu.Item key={item.key} onSelect={() => onSelect(item)}>
            <DropdownMenu.ItemTitle>{`${item.title}: ${item.subTitle}`}</DropdownMenu.ItemTitle>
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

import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import * as DropdownMenu from "zeego/dropdown-menu";

export interface DropDownMenuProps {
  items: Array<{
    key: string;
    title: string;
    icon: string;
  }>;
  onSelect: (key: string) => void;
}

const DropDown = ({ items, onSelect }: DropDownMenuProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        {items.map((item) => (
          <DropdownMenu.Item key={item.key} onSelect={() => onSelect(item.key)}>
            <DropdownMenu.ItemTitle>{item.title}</DropdownMenu.ItemTitle>
            <DropdownMenu.ItemIcon ios={{ name: item.icon }} />
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

const styles = StyleSheet.create({});

export default DropDown;

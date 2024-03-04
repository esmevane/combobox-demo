import { Item } from "@react-stately/collections";
import { useState } from "react";

import { Combobox } from "./combobox";

import "./App.css";

const items = [
  {
    id: "1",
    name: "Option one",
    render: <div>Option one</div>,
  },
  {
    id: "2",
    name: "Option two",
    render: <div>Option two</div>,
  },
];

function App() {
  const [selection, setSelection] = useState("");
  const [filter, setFilter] = useState("");

  return (
    <Combobox
      items={items.filter((item) =>
        item.name.toLowerCase().includes(filter.toLowerCase())
      )}
      inputValue={filter}
      label="Command"
      dropdown
      selectedKey={selection}
      onInputChange={setFilter}
      onSelectionChange={(key) => {
        setSelection(key as string);
      }}
    >
      {(item) => (
        <Item key={item.id} textValue={item.name}>
          {item.render}
        </Item>
      )}
    </Combobox>
  );
}

export default App;

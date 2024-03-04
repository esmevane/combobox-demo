import { useState } from "react";
import { Item } from "@react-stately/collections";
import { ComboBoxState } from "@react-stately/combobox";

import { Combobox } from "./combobox";

import "./App.css";

type CustomItemShapeWeJustMadeUp = {
  id: string;
  name: string;
  render: JSX.Element;
};

const items: CustomItemShapeWeJustMadeUp[] = [
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

  const onStateChange = (state: ComboBoxState<CustomItemShapeWeJustMadeUp>) => {
    console.log("New state:", state);
  };

  return (
    <div
      style={{ display: "grid", gridTemplate: "'combobox debug' / 1fr 2fr" }}
    >
      <div style={{ gridArea: "debug" }}>
        <p>Current state:</p>
        {/* <pre>{stringify(comboState, null, 2)}</pre> */}
      </div>
      <div style={{ gridArea: "combobox" }}>
        <Combobox
          items={items.filter((item) =>
            item.name.toLowerCase().includes(filter.toLowerCase())
          )}
          inputValue={filter}
          label="Command"
          dropdown
          selectedKey={selection}
          onStateChange={onStateChange}
          onInputChange={setFilter}
          onSelectionChange={(key) => {
            setSelection(key as string);
          }}
        >
          {(item: (typeof items)[number]) => (
            <Item key={item.id} textValue={item.name}>
              <div style={{ display: "flex", gap: "1rem" }}>
                <span>{item.render}</span>
                <span>{selection === item.id && "✔"}</span>
              </div>
            </Item>
          )}
        </Combobox>
      </div>
    </div>
  );
}

export default App;

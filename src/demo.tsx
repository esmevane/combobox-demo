import { Item } from "@react-stately/collections";
import { useState } from "react";

import { Combobox } from "./combobox";

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

function Demo() {
  const [value, setValue] = useState("");

  return (
    <main style={{ display: "flex", justifyContent: "center" }}>
      <Combobox
        defaultItems={items}
        label="Command"
        dropdown
        inputValue={value}
        onInputChange={setValue}
      >
        {(item) => (
          <Item key={item.id} textValue={item.name}>
            {item.render}
          </Item>
        )}
      </Combobox>
    </main>
  );
}

export default Demo;

import { Key } from "@react-types/shared";
import { Item } from "@react-stately/collections";
import JsonView from "react-json-view";
import { useCallback, useState } from "react";

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
  {
    id: "3",
    name: "Option three",
    render: <div>Option three</div>,
  },
  {
    id: "4",
    name: "Option four",
    render: <div>Option four</div>,
  },
  {
    id: "5",
    name: "Option five",
    render: <div>Option five</div>,
  },
  {
    id: "6",
    name: "Option six",
    render: <div>Option six</div>,
  },
  {
    id: "7",
    name: "Option seven",
    render: <div>Option seven</div>,
  },
];

function Demo() {
  const [id, setId] = useState<Key>("");
  const [state, setState] = useState({});
  const renderableItems = useCallback(
    (item: (typeof items)[number]) => (
      <Item key={item.id} textValue={item.name}>
        {item.render}
      </Item>
    ),
    []
  );

  return (
    <main
      style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        margin: "0 auto",
        width: "min(72ch, 90vw)",
      }}
    >
      <div style={{ zIndex: 1 }}>
        <Combobox
          onStateChange={setState}
          selectedKey={id}
          onSelectionChange={setId}
          defaultItems={items}
          label="Command"
          dropdown
        >
          {renderableItems}
        </Combobox>
      </div>
      <div
        style={{ padding: "1rem 0", display: "flex", flexDirection: "column" }}
      >
        <h2>State</h2>
        <p>State updates are throttled to prevent call size exceptions.</p>
        <JsonView
          src={state}
          theme="embers"
          name={false}
          collapsed
          sortKeys
          enableClipboard={false}
          style={{
            padding: "1rem",
            zIndex: 0,
            overflow: "hidden",
          }}
        />
      </div>
    </main>
  );
}

export default Demo;

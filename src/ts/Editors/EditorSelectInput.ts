import { EditorItem } from "./EditorItem";

export class EditorSelectInput extends EditorItem {
    constructor(
        data: unknown,
        private readonly name: string,
        private readonly label: string,
        private value: string,
        private readonly change: (value: string) => void
    ) {
        super(data);

        const select = this.element as HTMLSelectElement;

        select.id = `input_${this.name}`;

        select.addEventListener("change", () => {
            this.value = (this.element as HTMLInputElement).value;

            this.change(this.value);
        });
    }

    protected createElement(): HTMLElement {
        return document.createElement("select");
    }

    public addItem(value: string, text?: string, group?: string): void {
        const select = this.element as HTMLSelectElement;
        const item = document.createElement("option");
        const groupElement = select.querySelector(`[label=${group}]`);

        item.value = value;
        item.text = text ?? value;
        item.selected = this.value === value;

        (groupElement ?? select).append(item);
    }

    public addItemGroup(name: string): void {
        const select = this.element as HTMLSelectElement;
        const group = document.createElement("optgroup");

        group.label = name;

        select.append(group);
    }
}

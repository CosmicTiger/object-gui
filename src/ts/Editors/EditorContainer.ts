import { EditorItem } from "./EditorItem";
import { EditorButton } from "./EditorButton";
import { EditorStringInput } from "./EditorStringInput";
import { EditorNumberInput } from "./EditorNumberInput";
import { EditorCheckboxInput } from "./EditorCheckboxInput";
import { EditorSelectInput } from "./EditorSelectInput";
import { EditorColorInput } from "./EditorColorInput";
import { SingleOrMultiple } from "../Types/SingleOrMultiple";

export class EditorContainer extends EditorItem {
    public readonly children: EditorItem[];
    private readonly childrenContainer: HTMLElement;
    private readonly collapseButton: HTMLButtonElement;

    constructor(
        data: unknown,
        public readonly name: string,
        private readonly title: string,
        private collapsed: boolean,
        parent: HTMLElement
    ) {
        super(data);

        this.children = [];

        this.element.id = name;

        this.element.classList.add("editor", "container");

        const divTitle = document.createElement("div");

        divTitle.classList.add("title");

        const divName = document.createElement("div");

        divName.classList.add("name");

        const b = document.createElement("b");

        b.textContent = title;

        divName.append(b);
        divTitle.append(divName);

        const divCollapse = document.createElement("div");

        divCollapse.classList.add("collapse");

        this.collapseButton = document.createElement("button");

        this.collapseButton.type = "button";

        this.collapseButton.addEventListener("click", () => {
            this.toggleCollapse();
        });

        divCollapse.append(this.collapseButton);
        divTitle.append(divCollapse);

        this.element.append(divTitle);

        this.childrenContainer = document.createElement("div");

        this.childrenContainer.classList.add("container-content");

        this.element.append(this.childrenContainer);

        parent.append(this.element);

        this.setCollapse();
    }

    protected createElement(): HTMLElement {
        return document.createElement("div");
    }

    public addContainer(name: string, title: string, collapsed = true): EditorContainer {
        return new EditorContainer(this.data, `${this.name}_${name}`, title, collapsed, this.childrenContainer);
    }

    public addProperty(
        name: string,
        label: string,
        value: SingleOrMultiple<number | string | boolean | undefined | null>,
        type: string,
        change: (value: number | string | boolean) => void
    ): EditorItem {
        const divContainer = document.createElement("div");

        divContainer.classList.add("element");

        const htmlLabel = document.createElement("label");

        htmlLabel.textContent = label;

        divContainer.append(htmlLabel);

        let item: EditorItem;
        const inputName = `${this.name}_${name}`;

        switch (type) {
            case "number":
                item = new EditorNumberInput(this.data, inputName, label, value as number, change);
                break;
            case "boolean":
                item = new EditorCheckboxInput(this.data, inputName, label, value as boolean, change);
                break;
            case "color":
                item = new EditorColorInput(this.data, inputName, label, value as string, change);
                break;
            // case "range":
            //    break;
            case "select":
                item = new EditorSelectInput(this.data, inputName, label, value as string, change);
                break;
            default:
                item = new EditorStringInput(this.data, inputName, label, value as string, change);
        }

        if (value === undefined) {
            (item.element as HTMLInputElement).value = "";
        }

        divContainer.append(item.element);

        this.childrenContainer.append(divContainer);

        return item;
    }

    public addButton(name: string, label: string, click: () => void): void {
        const button = new EditorButton(this.data, `${this.name}_${name}`, label, click);

        this.childrenContainer.append(button.element);
    }

    private setCollapse(): void {
        if (this.collapsed) {
            this.childrenContainer.style.display = "none";
        } else {
            this.childrenContainer.style.display = "block";
        }

        if (this.collapsed) {
            this.collapseButton.textContent = "Expand";
        } else {
            this.collapseButton.textContent = "Collapse";
        }
    }

    public toggleCollapse(): void {
        this.collapsed = !this.collapsed;

        this.setCollapse();
    }
}

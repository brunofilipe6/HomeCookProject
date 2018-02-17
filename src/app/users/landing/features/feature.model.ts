export class Feature {
  id: Number;
  name: String;
  icon: String;
  description: String;

  constructor(id: Number, name: String, icon: String, description: String) {
    this.id = id;
    this.name = name;
    this.icon = icon;
    this.description = description;
  }
}
import { v4 } from "uuid";

class IdGenerated {
  generatedId = (): string => v4();
}

export default new IdGenerated();

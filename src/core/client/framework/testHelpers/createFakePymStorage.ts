import {
  createInMemoryStorage,
  createPromisifiedStorage,
} from "talk-framework/lib/storage";

export default function createFakePymStorage() {
  return createPromisifiedStorage(createInMemoryStorage());
}

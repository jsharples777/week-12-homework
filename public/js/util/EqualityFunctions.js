export default function isSameNote(item1, item2) {
  return item1.id === item2.id;
}
export function isSameNoteById(item1, item2Id) {
  return item1.id === item2Id;
}
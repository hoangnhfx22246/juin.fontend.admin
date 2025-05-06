import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
export default function SortIcon({ sort, field }) {
  if (sort.field !== field) return <FaSort />;
  return sort.order === "asc" ? (
    <FaSortUp className="text-blue-500" />
  ) : (
    <FaSortDown className="text-blue-500" />
  );
}

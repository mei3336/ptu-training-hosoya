import { Link } from "react-router-dom";
import Button from "@/components/Button";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-16 text-center">
      <h1>ページが見つかりません</h1>
      <p className="text-gray-600">
        お探しのページは存在しないか、移動・削除された可能性があります。
      </p>
      <Link to="/">
        <Button variant="primary">トップへ戻る</Button>
      </Link>
    </div>
  );
}

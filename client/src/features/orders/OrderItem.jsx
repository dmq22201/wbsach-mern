import { Link } from "react-router-dom";
import { formatCurrency } from "../../utilities/helper";

function OrderItem({ item }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-6">
        <div>
          <Link
            to={`/books/${item.slug}`}
            target="_blank"
            className="flex items-center gap-6"
          >
            <img
              src={item.coverImage}
              alt={item.name}
              className="h-20 w-20 rounded-lg"
            />
            <div className="flex flex-col gap-2">
              <p className="font-semibold">{item.name}</p>
              <p className="font-semibold text-red-500 dark:text-red-400">
                {formatCurrency(item.price * item.quantity)}
              </p>
              <p>Số lượng: {item.quantity}</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderItem;

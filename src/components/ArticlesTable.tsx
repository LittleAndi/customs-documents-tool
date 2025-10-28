import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Article } from "@/types/verification";

interface ArticlesTableProps {
  articles: Article[];
}

const ArticlesTable = ({ articles }: ArticlesTableProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const calculateTotal = () => {
    return articles.reduce((sum, article) => sum + article.totalPrice, 0);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Articles ({articles.length})</h3>
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Article Number</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Total Price</TableHead>
                <TableHead>Container</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono font-medium">
                    {article.articleNumber}
                  </TableCell>
                  <TableCell className="text-right">{article.quantity}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(article.unitPrice)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(article.totalPrice)}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {article.containerNumber}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50 font-semibold">
                <TableCell colSpan={3} className="text-right">
                  Total:
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(calculateTotal())}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ArticlesTable;

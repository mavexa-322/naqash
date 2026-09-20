import { Button } from "@/components/ui/button";

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-semibold text-foreground">Categories</h1>
          <p className="text-muted-foreground mt-2">Manage the main categories for the shop.</p>
        </div>
        <Button>Add New Category</Button>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="p-4 font-medium">Image</th>
              <th className="p-4 font-medium">Category Name</th>
              <th className="p-4 font-medium">Slug</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className="p-8 text-center text-muted-foreground">
                No categories found. Click "Add New Category" to create one.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

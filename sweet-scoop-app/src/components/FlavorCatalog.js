import FlavorItem from "./FlavorItem";

function FlavorCatalog({ flavors, onAddToOrder }) {
  return (
    <div className="flavor-grid">
      <h2 className="flavor-grid-title">Ice Cream Flavors</h2>
      {flavors.map((flavor) => (
        <FlavorItem key={flavor.id} flavor={flavor} onAddToOrder={onAddToOrder} />
      ))}
    </div>
  );
}

export default FlavorCatalog;

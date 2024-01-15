const navLinks = [
  {
    id: 1,
    name: "Clients",
  },
  {
    id: 2,
    name: "Items",
  },
];

export function Navigation() {
  return (
    <div>
      {navLinks.map((link) => (
        <p key={link.id}>{link.name}</p>
      ))}
    </div>
  );
}

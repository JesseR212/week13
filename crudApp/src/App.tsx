import "./App.css";

function App() {
  return (
    <div className="container mt-5">
      <h1 className="text-center">CRUD Application</h1>

      <form id="createForm">
        <div className="form-group">
          <label htmlFor="itemName">Item Name:</label>
          <input type="text" className="form-control" id="itemName" required />
        </div>
        <button type="submit" className="btn btn-primary">
          Create Item
        </button>
      </form>

      <hr />

      <h2>Items List</h2>

      <ul id="itemList" className="list-group"></ul>
    </div>
  );
}

export default App;

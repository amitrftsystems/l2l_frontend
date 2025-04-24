import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React, { Suspense } from "react";
import Spinner from "./components/utils/Spinner";

const HomePage = React.lazy(() => import("./pages/HomePage"));
const SignupPage = React.lazy(() => import("./pages/SignupPage"));
const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const PropertyDetailPage = React.lazy(() =>
  import("./pages/PropertyDetailPage")
);
const PropertyList = React.lazy(() =>
  import("./components/Property/propertyList/PropertyList")
);
const NewPropertyDetails = React.lazy(() =>
  import("./pages/NewPropertyDetails")
);

const App = () => {
  return (
    <Router>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/propertydetails" element={<PropertyDetailPage />} />
          <Route path="/properties" element={<PropertyList />} />
          {/* <Route path="/properties/:id" element={<PropertyDetailPage />} /> */}
          <Route path="/properties/:id" element={<NewPropertyDetails />} />
          <Route
            path="/new-properties-details"
            element={<NewPropertyDetails />}
          />
          {/* Redirect unknown routes to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;

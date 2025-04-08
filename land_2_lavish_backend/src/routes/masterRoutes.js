import express from "express";
import { addCustomer } from "../controllers/masterController/customer/addCustomer.js";
import { editCustomer } from "../controllers/masterController/customer/editCustomer.js";
import { getCustomers, getCustomerById, deleteCustomer } from "../controllers/masterController/customer/getCustomers.js";

import { addBank, getBanks, getBankById, updateBank, deleteBank } from "../controllers/masterController/bank.js";

import { addBroker, editBroker, getBroker, getBrokerById, deleteBroker } from "../controllers/masterController/broker.js";

import { addProject, updateProject, getProjects, getProjectById, deleteProject } from "../controllers/masterController/project.js";

import { addCoApplicant } from "../controllers/masterController/co-applicant.js";

import { addNewInstallmentPlan, getInstallments, getInstallmentById, updateInstallment, deleteInstallment } from "../controllers/masterController/plans.js";

import { addNewPLC, getPLC, getPLCById, updatePLC, deletePLC } from "../controllers/masterController/plc.js";

import { createProperty, updateProperty, getProperties, getPropertyById, deleteProperty } from "../controllers/masterController/property.js";

import { addNewPropertySize, getPropertySize, getPropertySizeById, updatePropertySize, deletePropertySize } from "../controllers/masterController/propertySize.js";

import { checkProject, checkOrCreateProperty, checkStockProperty,addStock } from "../controllers/masterController/stock.js";





const router = express.Router();

// customer
router.post("/add-customer", addCustomer);
router.put("/customer/:customer_id", editCustomer);
router.get("/get-customers", getCustomers);
router.get("/customer/:customer_id", getCustomerById);
router.delete("/customer/:customer_id", deleteCustomer);

// bank
router.post("/add-bank", addBank);
router.get("/get-banks", getBanks);
router.get("/bank/:id", getBankById);
router.put("/bank/:id", updateBank);
router.delete("/bank/:id", deleteBank);

// broker
router.post("/add-broker", addBroker);
router.put("/edit-broker/:id", editBroker);
router.get("/get-brokers", getBroker);
router.get("/get-broker/:id", getBrokerById);
router.delete("/broker/:id", deleteBroker);

// project
router.post("/add-project", addProject);
router.put("/project/:project_id", updateProject);
router.get("/get-projects", getProjects);
router.get("/projects/:id", getProjectById);
router.delete("/project/:project_id", deleteProject);

// co-applicant
router.post("/co-applicant", addCoApplicant);


// installment plan
router.post("/add-new-installment-plan", addNewInstallmentPlan);
router.get("/installment-plans", getInstallments);
router.get("/installment-plan/:installment_plan_id", getInstallmentById);
router.put("/installment-plan/:installment_plan_id", updateInstallment);
router.delete("/installment-plan/:installment_plan_id", deleteInstallment);

// plc
router.post("/add-new-plc", addNewPLC);
router.get("/plcs", getPLC);
router.get("/plc/:id", getPLCById);
router.put("/plc/:id", updatePLC);
router.delete("/plc/:id", deletePLC);

// property
router.post("/property", createProperty);
router.put("/property/:property_id", updateProperty);
router.get("/get-property", getProperties);
router.get("/property/:property_id", getPropertyById);
router.delete("/property/:property_id", deleteProperty);

// property size
router.post("/add-new-property-size", addNewPropertySize);
router.get("/property-sizes", getPropertySize);
router.get("/property-size/:property_size_id", getPropertySizeById);
router.put("/property-size/:property_size_id", updatePropertySize);
router.delete("/property-size/:property_size_id", deletePropertySize);

// stock
router.post("/stock", addStock);
router.post("/stock/check-project", checkProject);
router.post("/stock/check-property", checkOrCreateProperty);
router.post("/stock/check-stock-property", checkStockProperty);

export default router;
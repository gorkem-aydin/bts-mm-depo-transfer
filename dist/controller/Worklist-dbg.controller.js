sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox",
], function (BaseController, JSONModel, formatter, Filter, FilterOperator, MessageBox) {
	"use strict";

	return BaseController.extend("com.bizim.depotransfer.ZMM007_DEPO_TRANSFER.controller.Worklist", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function () {
			var oViewModel,

				oViewModel = new JSONModel({
					worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
					saveAsTileTitle: this.getResourceBundle().getText("saveAsTileTitle", this.getResourceBundle().getText("worklistViewTitle")),
					shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
					shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
					shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
					tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
					tableBusyDelay: 0
				});

			this.setModel(oViewModel, "worklistView");

		},

		onUpdateFinished: function (oEvent) {
			// update the worklist's object counter after the table update
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText("worklistTableTitle");
			}
			this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onPress: function (oEvent) {
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource());
		},
		onValueHelpBtnTeslimat: function (oEvent) {
			if (!this._Teslimatlar) {
				this._Teslimatlar = sap.ui.xmlfragment("com.bizim.depotransfer.ZMM007_DEPO_TRANSFER.fragments.Teslimat", this);
			}
			this.oViewModel = this.getOwnerComponent().getModel("worklistView");
			sap.ui.getCore().setModel(this.oViewModel, "worklistView");
			var oViewModel = this.getModel("worklistView");
			oViewModel.setProperty("/dialogbusy", true);
			var modelOrderCreate = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZMM007_TRANSFER_RF_SRV/", true);
			modelOrderCreate.read("/Zmm008ShTesSet", {
				success: function (oData) {
					oViewModel.setProperty("/Zmm008ShTes", oData.results);
				},
				error: function (oError) {
					try {
						var errMessage = JSON.parse(oError.responseText);
						errMessage = errMessage.error.message.value;
					} catch (e) {
						errMessage = oError.message;
					}
					sap.m.MessageBox.alert(errMessage, {
						icon: sap.m.MessageBox.Icon.ERROR,
						title: "Hata Oluştu!"
					});
					sap.ui.core.BusyIndicator.hide(0);
				}
			});
			this.getView().addDependent(this._Teslimatlar);
			this._Teslimatlar.open();
		},
		_handleValueHelpSearchTeslimat: function (evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter({
				filters: [
					new Filter("Vbeln", sap.ui.model.FilterOperator.Contains, sValue),
					new Filter("Kunnr", sap.ui.model.FilterOperator.Contains, sValue),
					new Filter("Vstel", sap.ui.model.FilterOperator.Contains, sValue)
				],
				and: false
			});
			evt.getSource().getBinding("items").filter(oFilter);
		},
		_handleValueHelpCloseTeslimat: function (evt) {
			var that = this;
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				that.getView().byId("idGondTeslimat").setValue(oSelectedItem.getTitle().slice(13, 23));
			}
			evt.getSource().getBinding("items").filter([]);
		},
		onValueHelpBtn: function (oEvent) {
			if (!this._MatbuIrsaliye) {
				this._MatbuIrsaliye = sap.ui.xmlfragment("com.bizim.depotransfer.ZMM007_DEPO_TRANSFER.fragments.MatbuIrsaliye", this);
			}
			this.oViewModel = this.getOwnerComponent().getModel("worklistView");
			sap.ui.getCore().setModel(this.oViewModel, "worklistView");
			var oViewModel = this.getModel("worklistView");
			oViewModel.setProperty("/dialogbusy", true);
			var modelOrderCreate = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZMM007_TRANSFER_RF_SRV/", true);
			modelOrderCreate.read("/Zmm008ShLifexSet", {
				success: function (oData) {
					oViewModel.setProperty("/Zmm008ShLifex", oData.results);
				},
				error: function (oError) {
					try {
						var errMessage = JSON.parse(oError.responseText);
						errMessage = errMessage.error.message.value;
					} catch (e) {
						errMessage = oError.message;
					}
					sap.m.MessageBox.alert(errMessage, {
						icon: sap.m.MessageBox.Icon.ERROR,
						title: "Hata Oluştu!"
					});
					sap.ui.core.BusyIndicator.hide(0);
				}
			});
			this.getView().addDependent(this._MatbuIrsaliye);
			this._MatbuIrsaliye.open();
		},
		handleTableValueHelpConfirm: function (e) {
			var s = e.getParameter("selectedItem");
			if (s) {
				this.byId(this.inputId).setValue(s.getBindingContext().getObject().Lifex);
				this.readRefresh(e);
			}
			this.oDialog.destroy();
		},
		handleValueHelpMatbuIrsaliye: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter(
				"Lifex",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},
		_handleValueHelpMatbuIrsaliye: function (oEvent) {
			var that = this;
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {

				that.byId("idMatbuIrsaliye").setValue(oSelectedItem.getTitle());

			}

		},

		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		onShareInJamPress: function () {
			var oViewModel = this.getModel("worklistView"),
				oShareDialog = sap.ui.getCore().createComponent({
					name: "sap.collaboration.components.fiori.sharing.dialog",
					settings: {
						object: {
							id: location.href,
							share: oViewModel.getProperty("/shareOnJamTitle")
						}
					}
				});
			oShareDialog.open();
		},

		onSearch: function (oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
			} else {
				var aTableSearchState = [];
				var sQuery = oEvent.getParameter("query");

				if (sQuery && sQuery.length > 0) {
					aTableSearchState = [new Filter("Arktx", FilterOperator.Contains, sQuery)];
				}
				this._applySearch(aTableSearchState);
			}

		},

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh: function () {
			var oTable = this.byId("table");
			oTable.getBinding("items").refresh();
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Shows the selected item on the object page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showObject: function (oItem) {
			this.getRouter().navTo("object", {
				objectId: oItem.getBindingContext().getProperty("Xblnr")
			});
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
		 * @private
		 */
		_applySearch: function (aTableSearchState) {
			var oTable = this.byId("table"),
				oViewModel = this.getModel("worklistView");
			oTable.getBinding("items").filter(aTableSearchState, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (aTableSearchState.length !== 0) {
				oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
			}
		},
		onPage2Barkod: function () {
			var that = this;
			if (that.byId("idEirsaliye").getValue() !== "" || that.byId("idMatbuIrsaliye").getValue() !== "" ||
				that.byId("idGondTeslimat").getValue() !== "")

			{
				var sObjectPath = "";
				var oViewModel = this.getModel("worklistView");
				var modelOrder = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZMM007_TRANSFER_RF_SRV/", true);

				sObjectPath = modelOrder.createKey("/GetPage1Set", {
					Xblnr: that.byId("idEirsaliye").getValue(),
					Lifex: that.byId("idMatbuIrsaliye").getValue(),
					VbelnVl: that.byId("idGondTeslimat").getValue(),
					PCheck: "X"
				});
				sap.ui.core.BusyIndicator.show(0);
				modelOrder.read(sObjectPath, {
					success: function (oData) {
						sap.ui.core.BusyIndicator.hide();
						if (oData.Type === "S") {
							that.route();
						}
					},
					error: function (e) {
						sap.ui.core.BusyIndicator.hide();
						var obj = JSON.parse(e.response.body);
						sap.m.MessageBox.show(obj.error.message.value, {
							icon: sap.m.MessageBox.Icon.ERROR,
							duration: 9000,
							width: "20em"
						});
					}
				});

			} else {
				sap.m.MessageBox.show("E-irsaliye No , Matbu İrsaliye No veya teslimatı doldurunuz. ", {
					icon: sap.m.MessageBox.Icon.ERROR,
					duration: 9000,
					width: "20em"
				});

			}
		},
		route: function () {
			var that = this;
			var itemLine = {
				Eirsaliye: that.getView("worklistView").byId("idEirsaliye").getValue(),
				MatbuIrsaliye: that.getView("worklistView").byId("idMatbuIrsaliye").getValue(),
				GondTeslimat: that.getView("worklistView").byId("idGondTeslimat").getValue()

			};
			var data = JSON.stringify(itemLine);
			this.getRouter().navTo("BarkodPage", {
				Type: "U",
				data: data
			}, false);
		}

	});
});
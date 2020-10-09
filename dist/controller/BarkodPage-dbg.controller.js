/*global location */
/*global history */
/*eslint no-undef: "error"*/
/* eslint-disable sap-no-ui5base-prop */
sap.ui.define([
	"com/bizim/depotransfer/ZMM007_DEPO_TRANSFER/controller/BaseController",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/ui/model/FilterOperator",
	"com/bizim/depotransfer/ZMM007_DEPO_TRANSFER/model/formatter",
	"sap/m/MessageBox"
], function (BaseController, MessageToast, Filter, JSONModel, History, FilterOperator, formatter, MessageBox) {
	"use strict";
	var data = "";

	return BaseController.extend("com.bizim.depotransfer.ZMM007_DEPO_TRANSFER.controller.BarkodPage", {
	formatter: formatter,
		onInit: function () {
			var oViewModel = new JSONModel({

				busy: false,
				delay: 0
			});
			this.tableData = [];
			this.getRouter().getRoute("BarkodPage").attachPatternMatched(this._onRouteMatched, this);

			this.getView().setModel(oViewModel);
			this.setModel(oViewModel, "ParkodPageView");
			oViewModel.setData(this.tableData);

		},
		onValueHelpBtnBarkod: function (oEvent) {
			if (!this._BarkodSH) {
				this._BarkodSH = sap.ui.xmlfragment("com.bizim.depotransfer.ZMM007_DEPO_TRANSFER.fragments.BarkodSH", this);
			}
			this.oViewModel = this.getOwnerComponent().getModel("ParkodPageView");
			sap.ui.getCore().setModel(this.oViewModel, "ParkodPageView");
			var oViewModel = this.getModel("ParkodPageView");
			oViewModel.setProperty("/dialogbusy", true);
			var modelOrderCreate = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZMM007_TRANSFER_RF_SRV/", true);
			modelOrderCreate.read("/Zmm009FmShBarkodSet", {
				success: function (oData) {
					oViewModel.setProperty("/Zmm009FmShBarkod", oData.results);
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
			this.getView().addDependent(this._BarkodSH);
			this._BarkodSH.open();
		},
		_handleValueHelpSearchBarkod: function (evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter({
				filters: [
					new Filter("Ean11", sap.ui.model.FilterOperator.Contains, sValue),
					new Filter("Matnr", sap.ui.model.FilterOperator.Contains, sValue),
					new Filter("Maktx", sap.ui.model.FilterOperator.Contains, sValue)
				],
				and: false
			});
			evt.getSource().getBinding("items").filter(oFilter);
		},
		_handleValueHelpCloseBarkod: function (evt) {
			var that = this;
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				that.getView().byId("idBarkod").setValue(oSelectedItem.getTitle());
			}
			evt.getSource().getBinding("items").filter([]);
		},
		_onRefreshTable: function (oEvent) {
			var oViewModel = this.getModel("ParkodPageView");
			var modelOrder = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZMM007_TRANSFER_RF_SRV/", true);
			var filters = new Array();
			var filterOrderNumber = new sap.ui.model.Filter("VbelnVl", sap.ui.model.FilterOperator.EQ, data.GondTeslimat);
			filters.push(filterOrderNumber);
			var filterOrderNumber1 = new sap.ui.model.Filter("Xblnr", sap.ui.model.FilterOperator.EQ, data.Eirsaliye);
			filters.push(filterOrderNumber1);
			var filterOrderNumber2 = new sap.ui.model.Filter("Lifex", sap.ui.model.FilterOperator.EQ, data.MatbuIrsaliye);
			filters.push(filterOrderNumber2);
			var filterOrderNumber3 = new sap.ui.model.Filter("PCheck", sap.ui.model.FilterOperator.EQ, "X");
			filters.push(filterOrderNumber3);
			modelOrder.read("/CheckXSet", {
				filters: filters,
				success: function (oData) {
					for (var i = 0; i < oData.results.length; i++) {
						if (oData.results[i].Vfdat) {
							oData.results[i].Vfdat = oData.results[i].Vfdat.toLocaleDateString();
						}
					}
					oViewModel.setProperty("/", oData.results);
				},
				error: function (e) {
					var obj = JSON.parse(e.response.body);
					sap.m.MessageBox.show(obj.error.message.value, {
						icon: sap.m.MessageBox.Icon.ERROR,
						duration: 9000,
						width: "20em"
					});
				}
			});
		},
		_onRouteMatched: function (oEvent) {
			var oViewModel = this.getModel("ParkodPageView");
			var oArgs = oEvent.getParameter("arguments");
			this.type = oArgs.Type;
			data = JSON.parse(oArgs.data);
			var modelOrder = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZMM007_TRANSFER_RF_SRV/", true);
			var filters = new Array();
			var filterOrderNumber = new sap.ui.model.Filter("VbelnVl", sap.ui.model.FilterOperator.EQ, data.GondTeslimat);
			filters.push(filterOrderNumber);
			var filterOrderNumber1 = new sap.ui.model.Filter("Xblnr", sap.ui.model.FilterOperator.EQ, data.Eirsaliye);
			filters.push(filterOrderNumber1);
			var filterOrderNumber2 = new sap.ui.model.Filter("Lifex", sap.ui.model.FilterOperator.EQ, data.MatbuIrsaliye);
			filters.push(filterOrderNumber2);
			var filterOrderNumber3 = new sap.ui.model.Filter("PCheck", sap.ui.model.FilterOperator.EQ, "X");
			filters.push(filterOrderNumber3);
			modelOrder.read("/CheckXSet", {
				filters: filters,
				success: function (oData) {
					for (var i = 0; i < oData.results.length; i++) {
						if (oData.results[i].Vfdat) {
							oData.results[i].Vfdat = oData.results[i].Vfdat.toLocaleDateString();
						}
					}
					oViewModel.setProperty("/", oData.results);
				},
				error: function (e) {
					var obj = JSON.parse(e.response.body);
					sap.m.MessageBox.show(obj.error.message.value, {
						icon: sap.m.MessageBox.Icon.ERROR,
						duration: 9000,
						width: "20em"
					});
				}
			});
		},
		onOkutulmayanBarkodlar: function () {
			var that = this;
			var oViewModel = this.getModel("ParkodPageView");
			oViewModel.setProperty("/BarkodTitle", "Eksik Barkodlar");
			var modelOrder = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZMM007_TRANSFER_RF_SRV/", true);
			if (that.getView("ParkodPageView").byId("idMiktar").getValue() === "") {
				var tmpZzmiktar = "0.0";
			} else {
				tmpZzmiktar = that.getView("ParkodPageView").byId("idMiktar").getValue();
			}
			if (that.getView("ParkodPageView").byId("idFazlaMiktar").getValue() === "") {
				var tmpZzfazla = "0.0";
			} else {
				tmpZzfazla = that.getView("ParkodPageView").byId("idFazlaMiktar").getValue();
			}
			if (that.getView("ParkodPageView").byId("idHasarliMik").getValue() === "") {
				var tmpZzhasarli = "0.0";
			} else {
				tmpZzhasarli = that.getView("ParkodPageView").byId("idHasarliMik").getValue();
			}
			var items = [];
			var headerSet = {};
			var myTable = {
				VbelnVl: data.GondTeslimat,
				Xblnr: data.Eirsaliye,
				Lifex: data.MatbuIrsaliye,
				Ean11: that.getView("ParkodPageView").byId("idBarkod").getValue(),
				Zzmiktar: tmpZzmiktar,
				Zzfazla: tmpZzfazla,
				Zzhasarli: tmpZzhasarli,
				Charg: ""
			};
			items.push(myTable);
			headerSet.to_BarkodItem = items;
			headerSet.to_BarkodList = [];
			headerSet.PBlist = "OKUTULMAYAN";
			modelOrder.create("/BarkodHeaderSet", headerSet, {
				// asynchronous: false,
				success: function (oData) {
					oViewModel.setProperty("/Barkodlar", oData.to_BarkodList.results);
					that.openFragment();
				},
				error: function (e) {
					var obj = JSON.parse(e.response.body);
					sap.m.MessageBox.show(obj.error.message.value, {
						icon: sap.m.MessageBox.Icon.ERROR,
						duration: 9000,
						width: "20em"
					});
					sap.ui.core.BusyIndicator.hide(0);
				}
			});
		},
		onEksikBarkodlar: function () {
			var that = this;
			var oViewModel = this.getModel("ParkodPageView");
			oViewModel.setProperty("/BarkodTitle", "Eksik Barkodlar");
			var modelOrder = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZMM007_TRANSFER_RF_SRV/", true);
			if (that.getView("ParkodPageView").byId("idMiktar").getValue() === "") {
				var tmpZzmiktar = "0.0";
			} else {
				tmpZzmiktar = that.getView("ParkodPageView").byId("idMiktar").getValue();
			}
			if (that.getView("ParkodPageView").byId("idFazlaMiktar").getValue() === "") {
				var tmpZzfazla = "0.0";
			} else {
				tmpZzfazla = that.getView("ParkodPageView").byId("idFazlaMiktar").getValue();
			}
			if (that.getView("ParkodPageView").byId("idHasarliMik").getValue() === "") {
				var tmpZzhasarli = "0.0";
			} else {
				tmpZzhasarli = that.getView("ParkodPageView").byId("idHasarliMik").getValue();
			}
			var items = [];
			var headerSet = {};
			var myTable = {
				VbelnVl: data.GondTeslimat,
				Xblnr: data.Eirsaliye,
				Lifex: data.MatbuIrsaliye,
				Ean11: that.getView("ParkodPageView").byId("idBarkod").getValue(),
				Zzmiktar: tmpZzmiktar,
				Zzfazla: tmpZzfazla,
				Zzhasarli: tmpZzhasarli,
				Charg: ""
			};
			items.push(myTable);
			headerSet.to_BarkodItem = items;
			headerSet.to_BarkodList = [];
			headerSet.PBlist = "EKSIK";
			modelOrder.create("/BarkodHeaderSet", headerSet, {
				// asynchronous: false,
				success: function (oData) {
					oViewModel.setProperty("/Barkodlar", oData.to_BarkodList.results);
					that.openFragment();
				},
				error: function (e) {
					var obj = JSON.parse(e.response.body);
					sap.m.MessageBox.show(obj.error.message.value, {
						icon: sap.m.MessageBox.Icon.ERROR,
						duration: 9000,
						width: "20em"
					});
					sap.ui.core.BusyIndicator.hide(0);
				}
			});
		},
		onFazlaBarkodlar: function () {
			var that = this;
			var oViewModel = this.getModel("ParkodPageView");
			oViewModel.setProperty("/BarkodTitle", "Eksik Barkodlar");
			var modelOrder = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZMM007_TRANSFER_RF_SRV/", true);
			if (that.getView("ParkodPageView").byId("idMiktar").getValue() === "") {
				var tmpZzmiktar = "0.0";
			} else {
				tmpZzmiktar = that.getView("ParkodPageView").byId("idMiktar").getValue();
			}
			if (that.getView("ParkodPageView").byId("idFazlaMiktar").getValue() === "") {
				var tmpZzfazla = "0.0";
			} else {
				tmpZzfazla = that.getView("ParkodPageView").byId("idFazlaMiktar").getValue();
			}
			if (that.getView("ParkodPageView").byId("idHasarliMik").getValue() === "") {
				var tmpZzhasarli = "0.0";
			} else {
				tmpZzhasarli = that.getView("ParkodPageView").byId("idHasarliMik").getValue();
			}
			var items = [];
			var headerSet = {};
			var myTable = {
				VbelnVl: data.GondTeslimat,
				Xblnr: data.Eirsaliye,
				Lifex: data.MatbuIrsaliye,
				Ean11: that.getView("ParkodPageView").byId("idBarkod").getValue(),
				Zzmiktar: tmpZzmiktar,
				Zzfazla: tmpZzfazla,
				Zzhasarli: tmpZzhasarli,
				Charg: ""
			};
			items.push(myTable);
			headerSet.to_BarkodItem = items;
			headerSet.to_BarkodList = [];
			headerSet.PBlist = "FAZLA";
			modelOrder.create("/BarkodHeaderSet", headerSet, {
				// asynchronous: false,
				success: function (oData) {
					oViewModel.setProperty("/Barkodlar", oData.to_BarkodList.results);
					that.openFragment();
				},
				error: function (e) {
					var obj = JSON.parse(e.response.body);
					sap.m.MessageBox.show(obj.error.message.value, {
						icon: sap.m.MessageBox.Icon.ERROR,
						duration: 9000,
						width: "20em"
					});
					sap.ui.core.BusyIndicator.hide(0);
				}
			});
		},
		openFragment: function () {
			if (!this._Barkod) {
				this._Barkod = sap.ui.xmlfragment("com.bizim.depotransfer.ZMM007_DEPO_TRANSFER.fragments.Barkodlar", this);
			}
			this.getView().addDependent(this._Barkod);
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._Barkod);
			this._Barkod.open();

		},
		onBarkodTemp: function () {
			var that = this;
			var sObjectPathBarkodTemp = "";
			var oViewModel = this.getModel("ParkodPageView");
			var modelOrder = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZMM007_TRANSFER_RF_SRV/", true);
			if (that.getView("ParkodPageView").byId("idMiktar").getValue() === "") {
				var tmpZzmiktar = "0.0";
			} else {
				tmpZzmiktar = that.getView("ParkodPageView").byId("idMiktar").getValue();
			}
			if (that.getView("ParkodPageView").byId("idFazlaMiktar").getValue() === "") {
				var tmpZzfazla = "0.0";
			} else {
				tmpZzfazla = that.getView("ParkodPageView").byId("idFazlaMiktar").getValue();
			}
			if (that.getView("ParkodPageView").byId("idHasarliMik").getValue() === "") {
				var tmpZzhasarli = "0.0";
			} else {
				tmpZzhasarli = that.getView("ParkodPageView").byId("idHasarliMik").getValue();
			}

			sObjectPathBarkodTemp = modelOrder.createKey("/GetBarkodTempSet", {
				PTemp: "X",
				Xblnr: data.Eirsaliye,
				Lifex: data.MatbuIrsaliye,
				VbelnVl: data.GondTeslimat,
				Ean11: that.getView("ParkodPageView").byId("idBarkod").getValue(),
				Zzmiktar: tmpZzmiktar,
				Zzfazla: tmpZzfazla,
				Zzhasarli: tmpZzhasarli

			});
			sap.ui.core.BusyIndicator.show(0);
			modelOrder.read(sObjectPathBarkodTemp, {
				success: function (oData) {
					sap.ui.core.BusyIndicator.hide();
					if (oData.Matnr) {
						that._onRefreshTable();
					}
					that.getView().getModel("ParkodPageView").refresh(true);
					that.byId("idBarkod").setValue("");
					that.byId("idMiktar").setValue("");
					that.byId("idFazlaMiktar").setValue("");
					that.byId("idHasarliMik").setValue("");
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
		},
		onBack: function () {
			history.go(-1);
		},
		onDialogCloseButton: function () {
			this._Barkod.close();
		},

		onDelete: function () {
			var that = this;
			if (this.byId("idTable").getSelectedContextPaths().length === 0) {
				sap.m.MessageBox.show("Lütfen silinecek satır seçiniz.", {
					icon: sap.m.MessageBox.Icon.ERROR,
					duration: 9000,
					width: "20em"
				});
			} else {
				var items = [];
				var headerSet = {};
				headerSet.PSil = "X";
				var oTable = that.byId("idTable");
				for (var i = 0; i < that.byId("idTable").getSelectedContextPaths().length; i++) {
					var myTable = {
						VbelnVl: oTable.getSelectedContexts()[0].oModel.oData[i].VbelnVl,
						// Posnr: tableListModel[path].Posnr,
						Matnr: oTable.getSelectedContexts()[0].oModel.oData[i].Matnr
					};
					items.push(myTable);
				}
				headerSet.to_DeleteHeader = items;
				var modelOrder = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZMM007_TRANSFER_RF_SRV/", true);
				modelOrder.create("/DeleteHeaderSet", headerSet, {
					// asynchronous: false,
					success: function (oData) {
						if (oData.Message) {
							sap.m.MessageBox.show(oData.Message, {
								icon: sap.m.MessageBox.Icon.SUCCESS,
								duration: 9000,
								width: "20em"
							});
						}
						that.byId("idTable").getSelectedContextPaths().reverse().map(function (path) {
							that.getView().getModel("ParkodPageView").getData().splice(path.slice(1, 2), 1);
						});
						that.byId("idTable").removeSelections();
						that.getView().getModel("ParkodPageView").refresh(true);
					},
					error: function (e) {
						var obj = JSON.parse(e.response.body);
						sap.m.MessageBox.show(obj.error.message.value, {
							icon: sap.m.MessageBox.Icon.ERROR,
							duration: 9000,
							width: "20em"
						});
						sap.ui.core.BusyIndicator.hide(0);
					}
				});
			}
		},
		onSave: function () {
			var that = this;
			var oViewModel = this.getModel("ParkodPageView");
			var items = [];
			var headerSet = {};
			var tableListModel = oViewModel.getProperty("/");
			headerSet.PSave = "X";
			for (var i = 0; i < tableListModel.length; i++) {
				var myTable = {
					VbelnVl: tableListModel[i].VbelnVl,
					Posnr: tableListModel[i].Posnr,
					Matnr: tableListModel[i].Matnr,
					Arktx: "",
					Zzmiktar: tableListModel[i].Zzmiktar,
					Del: ""
				};
				items.push(myTable);
			}
			headerSet.to_SaveItem = items;
			var modelOrder = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZMM007_TRANSFER_RF_SRV/", true);
			modelOrder.create("/SaveHeaderSet", headerSet, {
				// asynchronous: false,
				success: function (oData) {
					if (oData.Message) {
						sap.m.MessageBox.show(oData.Message, {
							icon: sap.m.MessageBox.Icon.SUCCESS,
							duration: 9000,
							width: "20em"
						});
					}
					that.tableItemData = {};
					that.tableData = [];
					oViewModel.setData(that.tableData);
				},
				error: function (e) {
					var obj = JSON.parse(e.response.body);
					sap.m.MessageBox.show(obj.error.message.value, {
						icon: sap.m.MessageBox.Icon.ERROR,
						duration: 9000,
						width: "20em"
					});
					sap.ui.core.BusyIndicator.hide(0);
				}
			});
		}
	});

});
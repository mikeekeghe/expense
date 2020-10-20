import React, { Component } from "react";
import { useState } from "react";

import {
  TouchableHighlight,
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Button,
  Alert,
  Text
} from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import { formatDateTime } from "./utilities";

const createSomethingsMissingAlert = () =>
  Alert.alert(
    "Something is Missing",
    "Please Entyer Required Field Data",
    [
      {
        text: "OK",
        onPress: () => console.log("<<<<< Somethings Missing>>>>>> ")
      }
    ],
    { cancelable: false }
  );

const createFinishedAddingAlert = () =>
  Alert.alert(
    "Finished Adding",
    "Succesfully finished Adding",
    [
      {
        text: "OK",
        onPress: () => console.log("ffffffffffffffff finished adding>>>>>> ")
      }
    ],
    { cancelable: false }
  );

class ExpenseForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: "",
      title: "",
      description: "",
      subcategory: "",
      thedatetime: "",
      amount: 0
    };
  }

  handleDatePicked = thedatetime => {
    this.setState({
      thedatetime
    });

    this.handleDatePickerHide();
  };

  handleDatePickerHide = () => {
    this.setState({
      showDatePicker: false
    });
  };

  handleDatePress = () => {
    this.setState({
      showDatePicker: true
    });
  };

  updateValue(text, fields) {
    if (fields == "title") {
      this.setState({
        title: text
      });
    } else if (fields == "amount") {
      this.setState({
        amount: text
      });
    }
  }
  submit = () => {
    if (
      isEmpty(this.state.title) ||
      isEmpty(this.state.amount) ||
      isEmpty(this.state.thedatetime)
    ) {
      createSomethingsMissingAlert();
    } else {
      let formData = new FormData();
      // let collection = {};
      formData.append("title", this.state.title);
      formData.append("amount", this.state.amount);
      formData.append("date_time", this.state.thedatetime);

      console.log(formData);
      fetch("https://facebook-dev-comp-api.herokuapp.com/add_exp.php", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data."
        },
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          console.log("Success:", data);
        })
        .catch(error => {
          console.error("Error:", error);
        }),
        this.setState({
          dataSource: "",
          title: "",
          description: "",
          subcategory: "",
          thedatetime: "",
          amount: 0
        });
      createFinishedAddingAlert();
    }
  };

  render() {
    return (
      <View
        style={{
          flex: 1
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <View style={styles.fieldContainer}>
            <TextInput
              style={styles.text}
              placeholder="Expense Title"
              spellCheck={false}
              name="myTitle"
              value={this.state.title}
              onChangeText={text => this.updateValue(text, "title")}
            />
          </View>
          <View style={styles.fieldContainer}>
            <TextInput
              style={styles.text}
              placeholder="Amount"
              spellCheck={false}
              keyboardType={"numeric"}
              name="myAmount"
              value={this.state.amount}
              onChangeText={text => this.updateValue(text, "amount")}
            />
          </View>
          <View style={styles.fieldContainer}>
            <TextInput
              style={[styles.text, styles.borderTop]}
              placeholder="Event date"
              spellCheck={false}
              editable={!this.state.showDatePicker}
              value={formatDateTime(this.state.thedatetime)}
            />
            <DateTimePicker
              isVisible={this.state.showDatePicker}
              mode="datetime"
              onConfirm={this.handleDatePicked}
              onCancel={this.handleDatePickerHide}
            />
          </View>

          <TouchableHighlight onPress={this.submit} style={styles.button}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableHighlight>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fieldContainer: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: "#fff"
  },
  text: {
    height: 40,
    margin: 0,
    marginRight: 7,
    paddingLeft: 10
  },
  borderTop: {
    borderColor: "#edeeef",
    borderTopWidth: 0.5
  },
  button: {
    height: 50,
    backgroundColor: "#48BBEC",
    borderColor: "#48BBEC",
    alignSelf: "stretch",
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5
  },
  buttonText: {
    color: "#fff",
    fontSize: 18
  }
});

function isEmpty(obj) {
  return obj.length === 0;
}
function nulifyAll() {}
export default ExpenseForm;

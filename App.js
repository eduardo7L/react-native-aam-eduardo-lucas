import React from 'react';
import * as ImagePicker from 'expo-image-picker';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableWithoutFeedback,
  ScrollView,
  Picker,
  Image
} from 'react-native';
import {
  TextInput,
  Button,
  Snackbar,
  Portal,
  Dialog,
  Paragraph,
  Provider as PaperProvider,
} from 'react-native-paper';

import { Ionicons } from '@expo/vector-icons';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      description: '',
      price: '',
      file: '',
      search: '',
      products: [],
      productsPesquisa: [],
      deleteItem: null,
      confirmVisible: false,
      updateEnable: true,
      selecteditem: null,
      isShowToTop: false,
    };
  }

_pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });
    
    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  getProducts = () => {
    fetch("https://crudpi.io/ecada9/AAMEduardoELucas").then(response => {
      response.json().then(data => {
        this.setState({
          products: data,
          productsPesquisa: data
        });
      });
    });
  }

  componentDidMount() {
    this.getProducts()
  }

  ///CRIA NOVO NÓ
  createItem() {
    
    this.setState({
          products: this.state.productsPesquisa
        });

    var name = this.state.name;
    var description = this.state.description;
    var price = this.state.price;
    var file = this.state.file;

    let products = this.state.products;

    products = products.map(product => {
      return product
    })

    products.push({
              name,
              description,
              price,
              file
            })

    this.setState({products})

    this.setState({
          productsPesquisa: this.state.products
        });

    this.limpaCampos();

  }

  ////ATUALIZA REGISTRO
  updateItem() {
    var originalName = this.state.selecteditem.name;
    var name = this.state.name;
    var description = this.state.description;
    var price = this.state.price;
    var file = this.state.file;
    
    this.setState({
          products: this.state.productsPesquisa
        });

    let products = this.state.products;

    products = products.map(product => {
      if(product.name === originalName){
          product.name = name
          product.description = description
          product.price = price
          product.file = file
      }

      return product
    })

    this.setState({products})

    this.setState({
          productsPesquisa: this.state.products
        });
    
    this.limpaCampos();

  }

/////////////////////////////////////////////////////////////////////
//APAGAR REGISTRO
  deleteItem(item) {
    
    this.setState({ deleteItem: item, confirmVisible: true });
  }
  performDeleteItem(key) {
    var name = key.name;
   
   this.setState({
          products: this.state.productsPesquisa
        });

    let products = this.state.products;

    products = products.map(product => {
      return product
    })
    
    const filteredProducts = products.filter(product => {
            return product.name != name
    })


    this.setState({
          products: filteredProducts
        });

    this.setState({
          productsPesquisa: this.state.products
        });

    this.limpaCampos();
    
  }

  pesquisarItens(){
    
    this.setState({
          products: this.state.productsPesquisa
        });

    let products = this.state.productsPesquisa;

    products = products.map(product => {
      return product
    })
    
    const filteredProducts = products.filter(product => {
            return product.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1 || 
               product.description.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1 || 
               product.price.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
    })

    this.setState({
          products: filteredProducts
        });

  }


  hideDialog(yesNo) {
    this.setState({ confirmVisible: false });
    if (yesNo === true) {
      this.performDeleteItem(this.state.deleteItem);
    }
  }
  /////////////////////////////////////////////////////////////

///FUNÇÃO LIMPA CAMPOS
 limpaCampos() {
    this.setState({
      name:'',
      description:'',
      price:'',
      /*
      deleteItem: null,
      confirmVisible: false,
      updateEnable: true,
      selecteditem: null,
      */
      });
  }

////COMPONENTE SEPARADOR
  renderSeparator = () => {
    return (
      <View
        style={{
          width: '90%',
          height: 2,
          backgroundColor: '#BBB5B3',
        }}>
        <View />
      </View>
    );
  };
///////////////////////////////////////////////
  render() {
    let { image } = this.state;

    return (
      <PaperProvider>
        <View style={styles.container}>
          <ScrollView>
            <Text style={styles.header}>Cadastro de Produtos</Text>

            <View style={{ height: 5 }} />

            <TextInput
              label="Nome"
              style={{
                height: 50,
                width: 250,
                borderColor: 'gray',
                borderWidth: 1,
              }}
              onChangeText={text => this.setState({ name: text })}
              value={this.state.name}
            />

            <View style={{ height: 5 }} />

            <TextInput
              label="Descrição"
              style={{
                height: 50,
                width: 250,
                borderColor: 'gray',
                borderWidth: 1,
              }}
              onChangeText={text => this.setState({ description: text })}
              value={this.state.description}
            />

            <View style={{ height: 5 }} />

            <TextInput
              label="Preço"
              style={{
                height: 50,
                width: 250,
                borderColor: 'gray',
                borderWidth: 1,
              }}
              onChangeText={text => this.setState({ price: text })}
              value={this.state.price}
            />

            <View style={{ height: 5 }} />

            <View style={{ flexDirection: 'row' }}>
              <Button
                style={{ width: 250, marginRight: 5 }}
                mode="contained"
                title="Escolha uma imagem"
                onPress={this._pickImage}
              >
              Escolha uma imagem
              </Button>
              
            </View>
            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}


            <View style={{ height: 10 }} />

            <View style={{ flexDirection: 'row' }}>
              <Button
                style={{ width: 100, marginRight: 5 }}
                mode="contained"
                onPress={() => this.createItem()}>
                Add
              </Button>

              <Button
                style={{ width: 100, marginLeft: 5 }}
                disabled={this.state.updateEnable}
                mode="contained"
                onPress={() => {
                  this.updateItem(), this.setState({ updateEnable: true });
                }}>
                Update
              </Button>
            </View>
            <Text style={styles.header}>Catálogo de Produtos</Text>
            
             <TextInput
              label="Texto para pesquisa"
              style={{
                height: 50,
                width: 250,
                borderColor: 'gray',
                borderWidth: 1,
              }}
              onChangeText={text => this.setState({ search: text })}
              value={this.state.search}
            />

            <View style={{ height: 5 }} />
            <Button
                style={{ width: 150, marginRight: 5 }}
                mode="contained"
                onPress={() => this.pesquisarItens()}>
                Pesquisar
              </Button>
            <FlatList
              onScroll={(e)=>this._onScroll(e)}
              data={this.state.products}
              renderItem={({ item }) => (
                <View>
                  <ScrollView vertical={false}>
                     <TouchableWithoutFeedback>
                      <View style={{ paddingTop: 10 }}>
                        <Text
                          style={{ color: '#4B0082' }}
                          >
                          <Ionicons onPress={() => this.deleteItem(item)} name="md-trash" size={20} />
                          <Text>     </Text>   
                          <Ionicons  onPress={() =>
                              this.setState({
                                name: item.name,
                                description: item.description,
                                price: item.price,
                                updateEnable: false,
                                selecteditem: item,
                              })
                            } name="md-create" size={20} />
                        </Text>
                        
                      </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                     onPress={() =>
                        this.setState({
                          name: item.name,
                          description: item.description,
                          price: item.price,
                          updateEnable: false,
                          selecteditem: item,
                        })
                      }>
                      <View>
                        <Text style={styles.item}>
                          Produto: {item.name}
                        </Text>
                        <Text style={styles.item}>
                          Descrição: {item.description}
                        </Text>
                        <Text style={styles.item}>
                          Preço: {item.price}
                        </Text>
                        {<Image source={{ uri: 'https://www.freeiconspng.com/uploads/no-image-icon-15.png' }} style={{ width: 100, height: 100 }} />}
                      </View>
                    </TouchableWithoutFeedback>
                  </ScrollView>
                </View>
              )}
              ItemSeparatorComponent={this.renderSeparator}
            />
            <Text />

            <Portal>
              <Dialog
                visible={this.state.confirmVisible}
                onDismiss={() => this.hideDialog(false)}>
                <Dialog.Title>Confirmação</Dialog.Title>

                <Dialog.Content>
                  <Paragraph>Você deseja apagar esse registro?</Paragraph>
                </Dialog.Content>

                <Dialog.Actions>
                  <Button onPress={() => this.hideDialog(true)}>Sim</Button>
                  <Button onPress={() => this.hideDialog(false)}>Não</Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          </ScrollView>
        </View>
      </PaperProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FFFA',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    alignItems: 'center',
  },
  header: {
    padding: 10,
    fontSize: 25,
    height: 55,
    alignItems: 'center',
  },
});

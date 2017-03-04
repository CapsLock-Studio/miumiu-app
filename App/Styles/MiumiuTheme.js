/**
 * Created by Calvin Huang on 2/16/17.
 */

const sharedStyle = {
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    paddingVertical: 11,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
}

export default style = {
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#EFEFF4'
  },
  titleText: {
    color: '#4A4A4A',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  contextText: {
    color: '#757575',
    fontSize: 14,
    lineHeight: 20,
  },
  roundButton: {
    alignSelf: 'stretch',
    borderRadius: 22,
    marginHorizontal: 10,
    borderWidth: 0.5,
    borderColor: 'white',
    marginTop: 20,
    marginBottom: 20,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 2,
    shadowOpacity: 1,
  },
  bulletItem: {
    flexDirection: 'row',
  },
  bulletContent: {
    flex: 1,
  },
  buttonDefault: {
    backgroundColor: '#9B9B9B',
  },
  buttonPrimary: {
    backgroundColor: '#4E9ACF',
  },
  buttonWarning: {
    backgroundColor: '#F5C163',
  },
  button: sharedStyle.button,
  buttonText: sharedStyle.buttonText,
  actionButton: {
    ...sharedStyle.button,
    borderRadius: 0,
    paddingVertical: 14,
  },
  actionButtonIcon: {
    marginRight: 10,
  },
  actionButtonText: {
    ...sharedStyle.buttonText,
    fontSize: 16,
  },
  textShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: {
      width: 0,
      height: 0.75,
    },
    textShadowRadius: 0.5,
  },
  textFieldGroup: {
    paddingBottom: 14,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    alignSelf: 'stretch',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    width: 295,
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
    borderRadius: 2,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    shadowOpacity: 1,
  },
  fixMKTextFieldStyleError: {
    flex: 1,
    flexDirection: 'column',
  },
};

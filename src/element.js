export default {
  type: "div",
<<<<<<< HEAD
  key: null,
  ref: null,
  props: {
    children: {
      type: "div",
      key: null,
      ref: null,
      props: {
        id: "A1",
        children: [
          {
            type: "div",
            key: null,
            ref: null,
            props: {
              id: "B1",
              children: [
                {
                  type: "div",
                  key: null,
                  ref: null,
                  props: {
                    id: "C1",
                    children: "c1",
                  },
                  _owner: null,
                  _store: {},
                },
                {
                  type: "div",
                  key: null,
                  ref: null,
                  props: {
                    id: "C2",
                    children: "c1",
                  },
                  _owner: null,
                  _store: {},
                },
              ],
            },
            _owner: null,
            _store: {},
          },
          {
            type: "div",
            key: null,
            ref: null,
            props: {
              id: "B2",
              children: "c1",
            },
            _owner: null,
            _store: {},
          },
        ],
      },
      _owner: null,
      _store: {},
    },
    id: "root",
  },
  _owner: null,
  _store: {},
=======
  props: {
    id: "A1",
    children: [
      {
        type: "div",
        props: {
          id: "B1",
          children: [
            {
              type: "div",
              props: {
                id: "C1",
              },
            },
            {
              type: "div",
              props: {
                id: "C2",
              },
            },
          ],
        },
      },
      {
        type: "div",
        props: {
          id: "B2",
        },
      },
    ],
  },
>>>>>>> c6e3860 (feat: fiber)
};

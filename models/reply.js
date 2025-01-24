import sequelize from '../config/database.js';

import { DataTypes } from 'sequelize';

const Reply = sequelize.define('Reply', {
    reply_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        
    },
    review_id: {
        type: DataTypes.STRING,
        references: {
        model: 'Reviews',
        key: 'review_id',
        },
    },
    parent_reply_id: {
        type: DataTypes.UUID,
        allowNull: true, // Nullable for top-level replies
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    reply_text: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    }, {
    timestamps: true,
    });

    // Set up self-referential association
    Reply.hasMany(Reply, { foreignKey: 'parent_reply_id', as: 'children' });
    Reply.belongsTo(Reply, { foreignKey: 'parent_reply_id', as: 'parent' });

// Sync the model
    Reply.sync()
    .then(() => console.log('Reply model synchronized'))
    .catch((err) => console.error('Error syncing Reply model:', err));

    export default Reply;
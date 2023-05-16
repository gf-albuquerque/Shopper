-- CreateTable
CREATE TABLE `products` (
    `code` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `costPrice` DECIMAL(9, 2) NOT NULL,
    `salesPrice` DECIMAL(9, 2) NOT NULL,

    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `packs` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `pack_id` BIGINT NOT NULL,
    `product_id` BIGINT NOT NULL,
    `qty` BIGINT NOT NULL,

    INDEX `packs_pack_id_idx`(`pack_id`),
    INDEX `packs_product_id_idx`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `packs` ADD CONSTRAINT `packs_pack_id_fkey` FOREIGN KEY (`pack_id`) REFERENCES `products`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `packs` ADD CONSTRAINT `packs_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;

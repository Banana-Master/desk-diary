-- DropForeignKey
ALTER TABLE `Follow` DROP FOREIGN KEY `Follow_followerId_fkey`;

-- DropForeignKey
ALTER TABLE `Follow` DROP FOREIGN KEY `Follow_followingId_fkey`;

-- DropForeignKey
ALTER TABLE `History` DROP FOREIGN KEY `History_UserId_fkey`;

-- DropForeignKey
ALTER TABLE `Report` DROP FOREIGN KEY `Report_reporterId_fkey`;

-- DropForeignKey
ALTER TABLE `Room` DROP FOREIGN KEY `Room_creatorId_fkey`;

-- DropForeignKey
ALTER TABLE `UserDetail` DROP FOREIGN KEY `UserDetail_UserId_fkey`;

-- DropForeignKey
ALTER TABLE `UserRoom` DROP FOREIGN KEY `UserRoom_RoomId_fkey`;

-- DropForeignKey
ALTER TABLE `UserRoom` DROP FOREIGN KEY `UserRoom_UserId_fkey`;

-- AlterTable
ALTER TABLE `Follow` DROP PRIMARY KEY,
    DROP COLUMN `followId`,
    ADD PRIMARY KEY (`followerId`, `followingId`);

-- AlterTable
ALTER TABLE `History` MODIFY `historyId` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `historyType` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Room` DROP PRIMARY KEY,
    DROP COLUMN `creatorId`,
    DROP COLUMN `deletedAt`,
    DROP COLUMN `roomThumnail`,
    ADD COLUMN `agoraAppId` VARCHAR(191) NOT NULL,
    ADD COLUMN `agoraToken` VARCHAR(191) NOT NULL,
    ADD COLUMN `note` VARCHAR(191) NULL,
    ADD COLUMN `roomThumbnail` VARCHAR(191) NULL,
    ADD COLUMN `uuid` VARCHAR(191) NOT NULL,
    MODIFY `roomId` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `nowHeadcount` INTEGER NOT NULL DEFAULT 0,
    MODIFY `category` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`roomId`);

-- AlterTable
ALTER TABLE `User` ADD COLUMN `isEmailVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `signupVerifyToken` VARCHAR(191) NULL,
    MODIFY `type` VARCHAR(191) NOT NULL DEFAULT 'user';

-- AlterTable
ALTER TABLE `UserDetail` DROP PRIMARY KEY,
    DROP COLUMN `UserDeailId`,
    DROP COLUMN `hobbyGoalTime`,
    DROP COLUMN `studyGoalTime`,
    ADD COLUMN `UserDetailId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `goalTime` INTEGER NULL,
    MODIFY `mainCategory` VARCHAR(191) NULL,
    MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD PRIMARY KEY (`UserDetailId`);

-- AlterTable
ALTER TABLE `UserRoom` DROP PRIMARY KEY,
    MODIFY `RoomId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`UserId`, `RoomId`);

-- CreateIndex
CREATE UNIQUE INDEX `Room_uuid_key` ON `Room`(`uuid`);

-- CreateIndex
CREATE UNIQUE INDEX `Room_agoraToken_key` ON `Room`(`agoraToken`);

-- CreateIndex
CREATE UNIQUE INDEX `User_signupVerifyToken_key` ON `User`(`signupVerifyToken`);

-- AddForeignKey
ALTER TABLE `Room` ADD CONSTRAINT `Room_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `History` ADD CONSTRAINT `History_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_reporterId_fkey` FOREIGN KEY (`reporterId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserDetail` ADD CONSTRAINT `UserDetail_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRoom` ADD CONSTRAINT `UserRoom_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRoom` ADD CONSTRAINT `UserRoom_RoomId_fkey` FOREIGN KEY (`RoomId`) REFERENCES `Room`(`roomId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Follow` ADD CONSTRAINT `Follow_followerId_fkey` FOREIGN KEY (`followerId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Follow` ADD CONSTRAINT `Follow_followingId_fkey` FOREIGN KEY (`followingId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;


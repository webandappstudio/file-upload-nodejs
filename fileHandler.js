
/**
 * File Validation / Sanity Check
 * @param {*} chunkNumber //Position of the current chunk in the array
 * @param {*} chunkSize //Size of the current chunk in bytes
 * @param {*} totalSize //Total size of the upload or sum of the all the chunks
 * @param {*} identifier //Upload Identifier
 * @param {*} filename //File name where the chunks belong to.
 * @param {*} fileSize //Size of the file (sum of the chunks should match)
 * @param {*} numberOfChunks //Total number of chunks to be handled
 * @returns string
 */
function validateRequest(chunkNumber, chunkSize, totalSize, identifier, filename, fileSize, numberOfChunks) {

    // Check request sanity
    if (chunkNumber == 0 || chunkSize == 0 || totalSize == 0 || identifier.length == 0 || filename.length == 0) {
    
        return 'sanity_check_failed';
    
    }
    var calculatedNumberOfChunks = Math.max(Math.floor(totalSize / (chunkSize * 1.0)), 1);

    //Validate current chunk has a valid position
    if (chunkNumber > numberOfChunks) {

        return 'chunk_checksum_failed';
    
    }

    // Validate file size with total chunk size
    if ($.maxFileSize && totalSize > $.maxFileSize) {

        return 'file_size_exceeded';
    }

    if (typeof(fileSize) != 'undefined') {

        // The chunk in the POST request isn't the correct size
        if (chunkNumber < numberOfChunks && fileSize != chunkSize) {

            return 'incorrect_post_size';

        }

        // The chunks in the POST is the last one, and the file is not the correct size
        if (numberOfChunks > 1 && chunkNumber == numberOfChunks && fileSize != ((totalSize % chunkSize) + parseInt(chunkSize)) && numberOfChunks == calculatedNumberOfChunks) {

            return 'last_post_chunk_checksum_failed';

        }

        // The file is only a single chunk, and the data size does not fit
        if (numberOfChunks == 1 && fileSize != totalSize) {

            return 'single_file_size_exceeded';

        }

        // The number of chunks wether matches to the calculated value nor to +1 in case of the forceChunkSize option
        if (numberOfChunks != calculatedNumberOfChunks && calculatedNumberOfChunks + 1 != numberOfChunks) {

            return 'chunk_count_invalid';

        }

        // The chunks in the POST is the last, and the file is not the correct size
        if (numberOfChunks > 1 && chunkNumber == numberOfChunks && fileSize != ((totalSize % chunkSize)) && numberOfChunks != calculatedNumberOfChunks) {

            return 'last_post_chunk_invalid_size';

        }

    }

    //return valid string
    return 'valid';

}